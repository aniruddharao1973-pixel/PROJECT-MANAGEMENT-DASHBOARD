// src/components/modals/viewfile/ViewFilePreview.jsx
import React, { useEffect, useState, useRef } from "react";
import { diffWords, diffSentences, diffLines } from "diff";
import Swal from "sweetalert2";
import DrawSignatureCanvas from "../../signature/DrawSignatureCanvas";
import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import CsvPreview from "../../filepreview/CsvPreview";
import ExcelPreview from "../../filepreview/ExcelPreview";

const FALLBACK_FILE_PATH = "/mnt/data/preview.png";

const ViewFilePreview = ({
  file,
  projectId,
  folderId,
  API_BASE,
  pushToast,
  user,
  onSignInsidePdf,
}) => {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  const isMobile = !isDesktop;

  /* ===== device-friendly file URL builder ===== */
  const filePath = file.file_path || FALLBACK_FILE_PATH;
  const normalizedPath = filePath.replace(/\\/g, "/");

  const resolveHostForDevice = (url) => {
    try {
      const u = new URL(url);
      if (
        (u.hostname === "localhost" || u.hostname === "127.0.0.1") &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        u.hostname = window.location.hostname;
        return u.toString();
      }
      return url;
    } catch (err) {
      return url;
    }
  };

  const makeAbsoluteFromBase = (base, path) => {
    const baseClean = base.replace(/\/$/, "");
    const pathClean = path.replace(/^\//, "");
    return `${baseClean}/${pathClean}`;
  };

  let fileUrl = "";
  if (normalizedPath.startsWith("http")) {
    fileUrl = resolveHostForDevice(normalizedPath);
  } else {
    fileUrl = makeAbsoluteFromBase(
      resolveHostForDevice(API_BASE.replace(/\/$/, "")),
      normalizedPath.replace(/^\//, ""),
    );
  }

  const filename = file.filename || "file";
  const ext = filename.split(".").pop().toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf";
  const isText = ext === "txt";
  const isCsv = ext === "csv";
  const isExcel = ["xlsx", "xls"].includes(ext);
  const isPpt = ["ppt", "pptx"].includes(ext);
  const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);
  const hasRenderedRef = useRef(false);

  /* ========================= ROLE GUARD ========================= */
  const canSign =
    user?.role === "admin" ||
    user?.role === "techsales" ||
    (user?.role === "customer" && file.allow_customer_sign === true) ||
    (user?.role === "department" && file.allow_department_sign === true);

  /* ========================= STATE ========================= */
  const [textContent, setTextContent] = useState("");
  const [oldText, setOldText] = useState("");
  const [savingTxt, setSavingTxt] = useState(false);
  const [placingSignature, setPlacingSignature] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const pdfRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  // const [bufferedPercent, setBufferedPercent] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);
  // const [contentLength, setContentLength] = useState(null);
  // const prefetchWindowBytes = 1024 * 1024 * 2;
  // const tailProbeEnabled = false;
  const [signatures, setSignatures] = useState([]);
  const [activeDragIndex, setActiveDragIndex] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [confirming, setConfirming] = useState(false);
  const signatureCanvasRef = useRef(null);

  useEffect(() => {
    // console.log("===== SIGNATURE STATE CHANGED =====", signatures);
  }, [signatures]);

  /* ========================= LOAD TXT CONTENT ========================= */
  useEffect(() => {
    if (isText) {
      fetch(fileUrl)
        .then((res) => res.text())
        .then((txt) => {
          setTextContent(txt);
          setOldText(txt);
        })
        .catch(() => setTextContent("⚠ Failed to load text file"));
    }
  }, [fileUrl, isText]);

  /* ========================= SAVE TXT AS NEW VERSION ========================= */
  const handleSaveTxt = async () => {
    if (!projectId || !folderId) {
      pushToast("Missing projectId or folderId", "error");
      return;
    }

    try {
      setSavingTxt(true);

      let changeLog = { changes: [] };
      const wordDiff = diffWords(oldText, textContent);
      const wordChanges = wordDiff.filter((p) => p.added || p.removed);

      if (wordChanges.length > 0) {
        wordChanges.forEach((part) => {
          changeLog.changes.push({
            type: "word",
            old: part.removed ? part.value : "",
            new: part.added ? part.value : "",
          });
        });
      } else {
        const sentenceDiff = diffSentences(oldText, textContent);
        const sentenceChanges = sentenceDiff.filter(
          (p) => p.added || p.removed,
        );

        if (sentenceChanges.length > 0) {
          sentenceChanges.forEach((part) => {
            changeLog.changes.push({
              type: "sentence",
              old: part.removed ? part.value : "",
              new: part.added ? part.value : "",
            });
          });
        } else {
          const paraDiff = diffLines(oldText, textContent);
          paraDiff
            .filter((p) => p.added || p.removed)
            .forEach((part) => {
              changeLog.changes.push({
                type: "paragraph",
                old: part.removed ? part.value : "",
                new: part.added ? part.value : "",
              });
            });
        }
      }

      changeLog.changed_by = {
        id: user.id,
        name: user.name,
        role: user.role,
      };

      const blob = new Blob([textContent], { type: "text/plain" });
      const editedFile = new File([blob], file.filename, {
        type: "text/plain",
      });

      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("folderId", folderId);
      formData.append("title", file.title);
      formData.append("comment", "Edited text file");
      formData.append("changeLog", JSON.stringify(changeLog));
      formData.append("file", editedFile);

      const token = localStorage.getItem("token");

      const resp = await fetch(`${API_BASE}/api/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!resp.ok) throw new Error("Upload failed");

      pushToast("Saved as new version", "success");
    } catch (err) {
      console.error(err);
      pushToast("Failed to save file", "error");
    } finally {
      setSavingTxt(false);
    }
  };

  /* ========================= PDF CLICK → PLACE SIGNATURE ========================= */
  const handlePdfClick = (e) => {
    if (!isDesktop) return;

    if (!placingSignature || !signatureImage || !pdfRef.current) return;

    const pages = Array.from(pdfRef.current.children);

    for (const pageEl of pages) {
      const rect = pageEl.getBoundingClientRect();

      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const pageNumber = Number(pageEl.dataset.pageNumber) || 1;
        const pageOffsetLeft = pageEl.offsetLeft;
        const pageOffsetTop = pageEl.offsetTop;
        const containerRect = pdfRef.current.getBoundingClientRect();
        const absX = pageOffsetLeft + clickX;
        const absY = pageOffsetTop + clickY;

        const newSign = {
          id: Date.now(),
          page: pageNumber,
          x: clickX,
          y: clickY,
          absX,
          absY,
          pageOffsetTop,
          pageOffsetLeft,
          width: 160,
          height: 60,
          pdfRenderWidth: rect.width,
          pdfRenderHeight: rect.height,
          signatureData: signatureImage,
        };

        console.log("Stored signature object →", newSign);

        setSignatures((prev) => [...prev, newSign]);
        setPlacingSignature(false);
        setSignatureImage(null);
        break;
      }
    }
  };

  /* ========================= PDF.JS MULTI PAGE RENDER ========================= */
  useEffect(() => {
    if (!isPdf) return;

    if (hasRenderedRef.current) return; // ✅ prevents double render
    hasRenderedRef.current = true;

    const container = pdfRef.current;
    if (!container) return;

    let cancelled = false;
    const abortController = new AbortController();

    const startRender = async () => {
      if (cancelled) return;
      console.log("PDF RENDER: startRender()", { fileUrl });

      try {
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

        // console.log("PDF RENDER: fetching", fileUrl);
        // const resp = await fetch(fileUrl, { signal: abortController.signal });

        // if (!resp.ok) {
        //   throw new Error(
        //     `Failed to fetch PDF: ${resp.status} ${resp.statusText}`,
        //   );
        // }

        // const data = await resp.arrayBuffer();
        // if (cancelled) return;

        // const loadingTask = pdfjs.getDocument({ data });
        const loadingTask = pdfjs.getDocument({
          url: fileUrl,
          withCredentials: false,
          rangeChunkSize: 65536,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        container.innerHTML = "";

        const renderTasks = [];
        const outputScale = Math.max(window.devicePixelRatio || 1, 1);

        const initialPages = Math.min(3, pdf.numPages);

        for (let pageNum = 1; pageNum <= initialPages; pageNum++) {
          if (cancelled) break;

          const page = await pdf.getPage(pageNum);

          let containerWidth = container.clientWidth;
          if (!containerWidth || containerWidth < 80) {
            containerWidth = Math.max(window.innerWidth - 32, 200);
          }

          const unscaledViewport = page.getViewport({ scale: 1 });
          if (!unscaledViewport.width || containerWidth <= 0) {
            console.warn("PDF RENDER: skipping page due to invalid sizes", {
              pageNum,
              unscaledViewport,
              containerWidth,
            });
            continue;
          }

          const scale = Math.min(
            (containerWidth - 32) / unscaledViewport.width,
            1.0,
          );
          const viewport = page.getViewport({ scale });

          const pageWrapper = document.createElement("div");
          pageWrapper.style.position = "relative";
          pageWrapper.style.display = "block";
          pageWrapper.style.marginLeft = "auto";
          pageWrapper.style.marginRight = "auto";
          pageWrapper.style.width = `${viewport.width}px`;
          pageWrapper.style.height = `${viewport.height}px`;
          pageWrapper.style.marginBottom = "16px";
          pageWrapper.style.background = "#fff";
          pageWrapper.dataset.pageNumber = pageNum;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const scaledWidth = Math.floor(viewport.width * outputScale);
          const scaledHeight = Math.floor(viewport.height * outputScale);

          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

          pageWrapper.appendChild(canvas);
          container.appendChild(pageWrapper);

          const renderTask = page.render({
            canvasContext: ctx,
            viewport,
          }).promise;

          renderTasks.push(renderTask);

          console.log("PDF RENDER: queued page", {
            pageNum,
            viewportWidth: viewport.width,
            viewportHeight: viewport.height,
          });
        }

        await Promise.all(renderTasks);

        setTimeout(async () => {
          for (
            let pageNum = initialPages + 1;
            pageNum <= pdf.numPages;
            pageNum++
          ) {
            if (cancelled) break;

            const page = await pdf.getPage(pageNum);

            let containerWidth = container.clientWidth;
            if (!containerWidth || containerWidth < 80) {
              containerWidth = Math.max(window.innerWidth - 32, 200);
            }

            const unscaledViewport = page.getViewport({ scale: 1 });
            const scale = Math.min(
              (containerWidth - 32) / unscaledViewport.width,
              1.0,
            );

            const viewport = page.getViewport({ scale });

            const pageWrapper = document.createElement("div");
            pageWrapper.style.position = "relative";
            pageWrapper.style.margin = "0 auto 16px";
            pageWrapper.style.width = `${viewport.width}px`;
            pageWrapper.style.height = `${viewport.height}px`;
            pageWrapper.dataset.pageNumber = pageNum;

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;

            pageWrapper.appendChild(canvas);
            container.appendChild(pageWrapper);

            await page.render({
              canvasContext: ctx,
              viewport,
            }).promise;
          }
        }, 300);

        if (cancelled) return;
        console.log("===== ALL PAGES RENDERED =====", {
          totalPages: pdf.numPages,
        });
      } catch (err) {
        if (cancelled) {
          console.log("PDF RENDER: cancelled", err);
          return;
        }

        if (err.name === "AbortError") {
          console.warn("PDF fetch aborted");
          return;
        }

        console.error("PDF RENDER ERROR:", err);
        pushToast(
          `Unable to render PDF preview: ${err?.message || "unknown error"}`,
          "error",
        );
      }
    };

    const tryImmediate = () => {
      const w = container.clientWidth || 0;
      if (w >= 80) {
        startRender();
        return true;
      }
      return false;
    };

    if (!tryImmediate()) {
      const ro = new ResizeObserver((entries) => {
        if (cancelled) {
          ro.disconnect();
          return;
        }
        for (const ent of entries) {
          const w = ent.contentRect?.width || container.clientWidth;
          if (w >= 80) {
            ro.disconnect();
            startRender();
            return;
          }
        }
      });

      ro.observe(container);

      const rafId = requestAnimationFrame(() => {
        if (!cancelled && container.clientWidth >= 80) {
          tryImmediate();
          ro.disconnect();
        }
      });

      return () => {
        cancelled = true;
        abortController.abort();
        ro.disconnect();
        cancelAnimationFrame(rafId);
      };
    }

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [file?.id]);

  useEffect(() => {
    hasRenderedRef.current = false;
  }, [file?.id]);

  useEffect(() => {
    const container = pdfRef.current;
    if (!container) return;

    setSignatures((prev) =>
      prev.map((s) => {
        const pageEl = container.querySelector(
          `[data-page-number="${s.page}"]`,
        );

        if (!pageEl) return s;

        return {
          ...s,
          absX: pageEl.offsetLeft + (s.x ?? 0),
          absY: pageEl.offsetTop + (s.y ?? 0),
          pageOffsetLeft: pageEl.offsetLeft,
          pageOffsetTop: pageEl.offsetTop,
        };
      }),
    );
  }, [signatures.length]);

  useEffect(() => {
    if (isPdf) {
      console.log("PDF URL:", fileUrl);
    }
  }, [file?.id]);

  useEffect(() => {
    const move = (e) => {
      if (activeDragIndex === null) return;

      e.preventDefault();
      e.stopPropagation();

      const container = pdfRef.current;
      if (!container) return;

      const lockScrollTop = container.scrollTop;
      const lockScrollLeft = container.scrollLeft;

      setSignatures((prev) => {
        const cur = [...prev];
        const s = cur[activeDragIndex];
        if (!s) return prev;

        const pageEl = container.querySelector(
          `[data-page-number="${s.page}"]`,
        );

        if (!pageEl) {
          console.warn("Drag skipped: page not mounted", s.page);
          return prev;
        }

        const cRect = container.getBoundingClientRect();

        const newAbsX = e.clientX - cRect.left - dragOffset.current.x;
        const newAbsY = e.clientY - cRect.top - dragOffset.current.y;

        const pageOffsetLeft = pageEl.offsetLeft;
        const pageOffsetTop = pageEl.offsetTop;
        const pageWidth = pageEl.clientWidth;
        const pageHeight = pageEl.clientHeight;

        const clampedAbsX = Math.max(
          pageOffsetLeft,
          Math.min(newAbsX, pageOffsetLeft + pageWidth - s.width),
        );

        const clampedAbsY = Math.max(
          pageOffsetTop,
          Math.min(newAbsY, pageOffsetTop + pageHeight - s.height),
        );

        const newPageX = clampedAbsX - pageOffsetLeft;
        const newPageY = clampedAbsY - pageOffsetTop;

        cur[activeDragIndex] = {
          ...s,
          absX: clampedAbsX,
          absY: clampedAbsY,
          x: newPageX,
          y: newPageY,
          pdfRenderWidth: s.pdfRenderWidth,
          pdfRenderHeight: s.pdfRenderHeight,
        };

        return cur;
      });

      container.scrollTop = lockScrollTop;
      container.scrollLeft = lockScrollLeft;
    };

    const up = (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setActiveDragIndex(null);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [activeDragIndex]);

  useEffect(() => {
    const container = pdfRef.current;
    if (!container) return;

    if (placingSignature) {
      const prevent = (e) => {
        e.preventDefault();
      };

      container.addEventListener("wheel", prevent, { passive: false });
      container.addEventListener("touchmove", prevent, { passive: false });

      return () => {
        container.removeEventListener("wheel", prevent);
        container.removeEventListener("touchmove", prevent);
      };
    }
  }, [placingSignature]);

  useEffect(() => {
    const container = pdfRef.current;
    if (!container || !placingSignature) return;

    const lock = (e) => {
      if (
        signatureCanvasRef.current &&
        signatureCanvasRef.current.contains(e.target)
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      container.style.overflow = "hidden";
    };

    const unlock = () => {
      container.style.overflow = "auto";
    };

    container.addEventListener("wheel", lock, { passive: false });
    container.addEventListener("touchmove", lock, { passive: false });
    container.addEventListener("scroll", lock, { passive: false });

    window.addEventListener("wheel", lock, { passive: false });
    window.addEventListener("touchmove", lock, { passive: false });

    return () => {
      container.removeEventListener("wheel", lock);
      container.removeEventListener("touchmove", lock);
      container.removeEventListener("scroll", lock);

      window.removeEventListener("wheel", lock);
      window.removeEventListener("touchmove", lock);

      unlock();
    };
  }, [placingSignature]);

  useEffect(() => {
    if (!isDesktop) {
      setPlacingSignature(false);
      setSignatureImage(null);
      setSignatures([]);
    }
  }, []);

  // useEffect(() => {
  //   if (!isVideo) return;

  //   (async () => {
  //     try {
  //       const headResp = await fetch(fileUrl, { method: "HEAD" });
  //       if (headResp.ok) {
  //         const len = headResp.headers.get("Content-Length");
  //         if (len) setContentLength(parseInt(len, 10));
  //       }
  //     } catch (e) {
  //       console.warn("HEAD failed for video:", e);
  //     }
  //   })();
  // }, [fileUrl, isVideo]);

  // useEffect(() => {
  //   const v = videoRef.current;
  //   if (!v) return;

  //   const storageKey = `video-progress-${file.id}`;

  //   const onLoadedMetadata = () => {
  //     setDuration(v.duration);
  //     setVideoLoading(false);
  //     const saved = localStorage.getItem(storageKey);
  //     if (saved) v.currentTime = parseFloat(saved);
  //   };

  //   const onTimeUpdate = () => {
  //     setCurrentTime(v.currentTime);
  //     localStorage.setItem(storageKey, v.currentTime);

  //     if (v.buffered.length) {
  //       const bufferedEnd = v.buffered.end(v.buffered.length - 1);
  //       setBufferedPercent((bufferedEnd / v.duration) * 100);
  //     }
  //   };

  //   const onPlay = () => setIsPlaying(true);
  //   const onPause = () => setIsPlaying(false);
  //   const onWaiting = () => setVideoLoading(true);
  //   const onPlaying = () => setVideoLoading(false);

  //   v.addEventListener("loadedmetadata", onLoadedMetadata);
  //   v.addEventListener("timeupdate", onTimeUpdate);
  //   v.addEventListener("play", onPlay);
  //   v.addEventListener("pause", onPause);
  //   v.addEventListener("waiting", onWaiting);
  //   v.addEventListener("playing", onPlaying);

  //   return () => {
  //     v.removeEventListener("loadedmetadata", onLoadedMetadata);
  //     v.removeEventListener("timeupdate", onTimeUpdate);
  //     v.removeEventListener("play", onPlay);
  //     v.removeEventListener("pause", onPause);
  //     v.removeEventListener("waiting", onWaiting);
  //     v.removeEventListener("playing", onPlaying);
  //   };
  // }, [fileUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoadedMetadata = () => {
      setDuration(v.duration || 0);
      setVideoLoading(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
    };

    const onPlay = () => {
      setIsPlaying(true);
      setVideoLoading(false);
    };

    const onPause = () => setIsPlaying(false);

    const onWaiting = () => {
      if (!isMobile) setVideoLoading(true);
    };

    const onPlaying = () => setVideoLoading(false);

    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);

    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
    };
  }, [fileUrl, isMobile]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  };

  const skipTime = (seconds) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime += seconds;
  };

  const changeSpeed = (rate) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // const goFullscreen = () => {
  //   if (videoRef.current?.requestFullscreen) {
  //     videoRef.current.requestFullscreen();
  //   }
  // };

  const goFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.webkitEnterFullscreen) {
      v.webkitEnterFullscreen(); // iOS Safari
      return;
    }

    if (v.requestFullscreen) {
      v.requestFullscreen();
    }
  };

  // const estimateByteOffset = (targetTime) => {
  //   const v = videoRef.current;
  //   if (!v || !contentLength || !isFinite(v.duration) || v.duration <= 0)
  //     return null;

  //   const ratio = Math.min(Math.max(targetTime / v.duration, 0), 1);
  //   const offset = Math.floor(ratio * contentLength);
  //   return Math.max(0, Math.min(contentLength - 1, offset));
  // };

  // const prefetchRangeAround = async (offset) => {
  //   if (!offset || offset < 0 || !contentLength) return;

  //   try {
  //     const start = Math.max(0, offset - 1024 * 1024);
  //     const end = Math.min(contentLength - 1, start + 2 * 1024 * 1024);

  //     await fetch(fileUrl, {
  //       method: "GET",
  //       headers: { Range: `bytes=${start}-${end}` },
  //     });
  //   } catch (e) {
  //     console.debug("prefetchRange failed");
  //   }
  // };

  // useEffect(() => {
  //   const v = videoRef.current;
  //   if (!v) return;

  //   const onSeeking = () => {
  //     const estimated = estimateByteOffset(v.currentTime);
  //     if (estimated !== null) {
  //       prefetchRangeAround(estimated);
  //     }
  //     setVideoLoading(true);
  //   };

  //   v.addEventListener("seeking", onSeeking);

  //   return () => {
  //     v.removeEventListener("seeking", onSeeking);
  //   };
  // }, [contentLength, fileUrl]);

  return (
    <div className="relative flex-1 min-w-0 min-h-0 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 rounded-t-none sm:rounded-t-xl md:rounded-l-xl overflow-hidden h-full">
      {/* ===== MODERN HEADER WITH GRADIENT ===== */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
              {filename}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {ext} File
            </p>
          </div>
        </div>

        {/* ===== DESKTOP ACTION BUTTONS (GLASS EFFECT) ===== */}
        <div className="hidden md:flex items-center gap-2">
          {isPdf && canSign && isDesktop && (
            <button
              onClick={() => setPlacingSignature(true)}
              className="group relative px-4 py-2.5 text-sm font-semibold rounded-xl
                bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                hover:from-blue-600 hover:to-indigo-700
                shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Add Signature
              </span>
            </button>
          )}

          {isPdf && signatures.length > 0 && (
            <button
              className="group relative px-4 py-2.5 text-sm font-semibold rounded-xl
                bg-gradient-to-r from-emerald-500 to-green-600 text-white
                hover:from-emerald-600 hover:to-green-700
                shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40
                transition-all duration-300 hover:scale-105"
              onClick={async () => {
                await onSignInsidePdf({ signatures });
                setSignatures([]);
                setPlacingSignature(false);
                setSignatureImage(null);
              }}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save All ({signatures.length})
              </span>
            </button>
          )}
        </div>

        {/* ===== MOBILE NOTICE ===== */}
        {isPdf && !isDesktop && (
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-[10040]
            bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200
            px-4 py-3 text-center text-xs font-medium text-amber-800 backdrop-blur-sm"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Signing available on desktop only
            </span>
          </div>
        )}
      </div>

      {/* ===== PDF PREVIEW (MODERN CARD) ===== */}
      {isPdf && (
        <div
          className={`
            relative w-full h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)]
            rounded-2xl shadow-2xl shadow-slate-900/10
            bg-white/80 backdrop-blur-sm border border-slate-200/50
            overflow-auto overscroll-contain
            px-4 sm:px-6
            ${placingSignature ? "cursor-crosshair" : ""}
          `}
          onClick={handlePdfClick}
        >
          <div
            ref={pdfRef}
            className="relative min-h-full flex flex-col items-center py-4"
            onMouseMove={(e) => {
              if (!placingSignature || !signatureImage || !pdfRef.current)
                return;

              e.preventDefault();
              e.stopPropagation();

              const container = pdfRef.current;
              const lockedScrollTop = container.scrollTop;
              const lockedScrollLeft = container.scrollLeft;
              const cRect = container.getBoundingClientRect();

              container._floatingX = e.clientX - cRect.left;
              container._floatingY = e.clientY - cRect.top;

              container.scrollTop = lockedScrollTop;
              container.scrollLeft = lockedScrollLeft;
            }}
          />

          {/* ===== SIGNATURE OVERLAYS ===== */}
          {signatures.map((s, index) => {
            const pageEl = pdfRef.current?.querySelector(
              `[data-page-number="${s.page}"]`,
            );

            if (!pageEl) {
              return (
                <img
                  key={s.id}
                  src={s.signatureData}
                  alt="signature-loading"
                  style={{
                    position: "absolute",
                    left: s.absX ?? 0,
                    top: s.absY ?? 0,
                    width: s.width,
                    height: s.height,
                    opacity: 0.3,
                    pointerEvents: "none",
                    zIndex: 50,
                  }}
                />
              );
            }

            const currentPageOffsetLeft = pageEl.offsetLeft;
            const currentPageOffsetTop = pageEl.offsetTop;
            const displayX = currentPageOffsetLeft + s.x;
            const displayY = currentPageOffsetTop + s.y;

            return (
              <img
                key={s.id}
                src={s.signatureData}
                alt="signature"
                className="ring-2 ring-blue-400/50 rounded-lg shadow-lg hover:ring-blue-500 transition-all"
                style={{
                  position: "absolute",
                  left: displayX,
                  top: displayY,
                  width: s.width,
                  height: s.height,
                  cursor: "move",
                  zIndex: 50,
                  userSelect: "none",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const cRect = pdfRef.current.getBoundingClientRect();

                  dragOffset.current = {
                    x: e.clientX - cRect.left - displayX,
                    y: e.clientY - cRect.top - displayY,
                  };

                  setActiveDragIndex(index);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const touch = e.touches?.[0];
                  if (!touch) return;

                  const cRect = pdfRef.current.getBoundingClientRect();

                  dragOffset.current = {
                    x: touch.clientX - cRect.left - displayX,
                    y: touch.clientY - cRect.top - displayY,
                  };

                  setActiveDragIndex(index);
                }}
              />
            );
          })}

          {/* ===== FLOATING SIGNATURE PREVIEW ===== */}
          {placingSignature && signatureImage && pdfRef.current && (
            <div
              className="pointer-events-none absolute z-[100] ring-2 ring-blue-400 rounded-lg shadow-2xl"
              style={{
                left: (pdfRef.current._floatingX ?? 0) - 20,
                top: (pdfRef.current._floatingY ?? 0) - 10,
                width: 160,
                height: 60,
                backgroundImage: `url(${signatureImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                opacity: 0.9,
                transform: "translate(-40px,-20px)",
              }}
            />
          )}

          {placingSignature && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none backdrop-blur-[1px]" />
          )}
        </div>
      )}

      {/* ===== SIGNATURE CANVAS (GLASS MORPHISM) ===== */}
      {isPdf && placingSignature && isDesktop && (
        <div
          ref={signatureCanvasRef}
          className="absolute bottom-20 sm:bottom-6 left-4 right-4 sm:right-auto sm:w-[360px]
            bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl
            border border-slate-200/50 z-[11000] p-4
            ring-1 ring-slate-900/5"
          style={{
            touchAction: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <DrawSignatureCanvas
            onSave={(data) => {
              setSignatureImage(data);
              pushToast("Click on document to place signature", "success");
            }}
            onCancel={() => {
              setPlacingSignature(false);
              setSignatureImage(null);
            }}
          />
        </div>
      )}

      {/* ===== IMAGE PREVIEW (MODERN CARD) ===== */}
      {isImage && (
        <div className="flex justify-center items-center h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] p-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-25 group-hover:opacity-40 blur transition duration-300"></div>
            <img
              src={fileUrl}
              alt="Preview"
              className="relative max-h-full max-w-full rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* ===== VIDEO PREVIEW (SLEEK PLAYER) ===== */}
      {isVideo && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
          {/* <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-slate-700 to-slate-800 w-full z-20">
            <div
              className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${bufferedPercent}%` }}
            />
          </div> */}

          {videoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30 pointer-events-none">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-full">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white text-sm font-medium">
                  Buffering…
                </span>
              </div>
            </div>
          )}

          {/* <video
            ref={videoRef}
            key={fileUrl}
            preload="auto"
            playsInline
            onLoadedData={() => setVideoLoading(false)}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full max-h-[70vh] bg-black"
          >
            <source
              src={fileUrl}
              type={`video/${ext === "mov" ? "mp4" : ext}`}
            />
          </video> */}

          <video
            ref={videoRef}
            key={fileUrl}
            preload="auto" // REQUIRED for IIS
            playsInline
            controls // Native controls = max compatibility
            muted={isMobile} // iOS autoplay permission
            className="w-full max-h-[70vh] bg-black"
          >
            <source src={fileUrl} type="video/mp4" />
          </video>

          {/* ===== MODERN VIDEO CONTROLS ===== */}
          {!isMobile && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-md p-4">
              <div className="flex items-center gap-3 text-white text-sm">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>

                <button
                  onClick={() => skipTime(-10)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                >
                  ⏪ 10s
                </button>

                <button
                  onClick={() => skipTime(10)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                >
                  10s ⏩
                </button>

                <div className="flex-1 text-center font-medium">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </div>

                <select
                  value={playbackRate}
                  onChange={(e) => changeSpeed(Number(e.target.value))}
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg px-2 py-1 hover:bg-white/20 transition-all"
                >
                  <option value="0.5" className="bg-gray-900">
                    0.5x
                  </option>
                  <option value="1" className="bg-gray-900">
                    1x
                  </option>
                  <option value="1.5" className="bg-gray-900">
                    1.5x
                  </option>
                  <option value="2" className="bg-gray-900">
                    2x
                  </option>
                </select>

                <button
                  onClick={goFullscreen}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  ⛶
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== CSV PREVIEW ===== */}
      {isCsv && (
        <div className="h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] min-h-0 flex rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50">
          <CsvPreview fileUrl={fileUrl} />
        </div>
      )}

      {/* ===== EXCEL PREVIEW ===== */}
      {isExcel && (
        <div className="h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] min-h-0 flex rounded-2xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50">
          <ExcelPreview fileUrl={fileUrl} />
        </div>
      )}

      {/* ===== POWERPOINT NOT SUPPORTED ===== */}
      {isPpt && (
        <div className="h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] flex flex-col items-center justify-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-4xl mb-6 shadow-lg">
            📊
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">
            PowerPoint Preview Not Available
          </h3>

          <p className="text-sm text-gray-600 mb-8 max-w-md leading-relaxed">
            PPT/PPTX files cannot be previewed inside the dashboard. Please
            download the file to view it in Microsoft PowerPoint.
          </p>

          <a
            href={fileUrl}
            download
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 font-semibold"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download File
            </span>
          </a>
        </div>
      )}

      {/* ===== TEXT EDITOR (MODERN STYLING) ===== */}
      {isText && (
        <div className="h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] flex flex-col gap-3">
          <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <textarea
              className="w-full h-full p-4 sm:p-5 text-xs sm:text-sm font-mono bg-transparent resize-none focus:outline-none"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Start typing..."
            />
          </div>

          <button
            onClick={handleSaveTxt}
            disabled={savingTxt}
            className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center justify-center gap-2">
              {savingTxt ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving…
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save New Version
                </>
              )}
            </span>
          </button>
        </div>
      )}

      {/* ===== UNKNOWN FILE TYPE ===== */}
      {!isPdf &&
        !isImage &&
        !isText &&
        !isCsv &&
        !isExcel &&
        !isPpt &&
        !isVideo && (
          <div className="h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] flex flex-col justify-center items-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-4xl mb-6 shadow-lg">
              📄
            </div>
            <p className="text-gray-700 text-base sm:text-lg font-medium text-center">
              Preview not supported for this file type
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please download the file to view its contents
            </p>
          </div>
        )}
    </div>
  );
};

export default ViewFilePreview;
