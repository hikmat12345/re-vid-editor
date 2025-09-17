"use client"
import { Editor } from '@/components/editor/version-7.0.0/components/core/editor'
import { AssetLoadingProvider } from '@/components/editor/version-7.0.0/contexts/asset-loading-context'
import { EditorProvider } from '@/components/editor/version-7.0.0/contexts/editor-context'
import { KeyframeProvider } from '@/components/editor/version-7.0.0/contexts/keyframe-context'
import { TimelineProvider } from '@/components/editor/version-7.0.0/contexts/timeline-context'
import { SidebarProvider as UISidebarProvider } from '@/components/ui/sidebar'
import { SidebarProvider as EditorSidebarProvider } from '@/components/editor/version-7.0.0/contexts/sidebar-context'
import React, { useCallback, useEffect, useState } from 'react'
import { AppSidebar } from '@/components/editor/version-7.0.0/components/sidebar/app-sidebar'
import { useOverlays } from '@/components/editor/version-7.0.0/hooks/use-overlays'
import { AUTO_SAVE_INTERVAL, DEFAULT_OVERLAYS, FPS, RENDER_TYPE } from '@/components/editor/version-7.0.0/constants'
import { useVideoPlayer } from '@/components/editor/version-7.0.0/hooks/use-video-player'
import { useCompositionDuration } from '@/components/editor/version-7.0.0/hooks/use-composition-duration'
import { useAspectRatio } from '@/components/editor/version-7.0.0/hooks/use-aspect-ratio'
import { Overlay } from '@/components/editor/version-7.0.0/types'
import { useTimelineClick } from '@/components/editor/version-7.0.0/hooks/use-timeline-click'
import { useRendering } from '@/components/editor/version-7.0.0/hooks/use-rendering'
import { useHistory } from '@/components/editor/version-7.0.0/hooks/use-history'
import { useAutosave } from '@/components/editor/version-7.0.0/hooks/use-autosave'
import { LocalMediaProvider } from '@/components/editor/version-7.0.0/contexts/local-media-context'

function RemotionEditor() {

    // Autosave state
    const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
    const [autosaveTimestamp, setAutosaveTimestamp] = useState<number | null>(
        null
    );
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Overlay management hooks
    const {
        overlays,
        setOverlays,
        selectedOverlayId,
        setSelectedOverlayId,
        changeOverlay,
        addOverlay,
        deleteOverlay,
        duplicateOverlay,
        splitOverlay,
        deleteOverlaysByRow,
        updateOverlayStyles,
        resetOverlays,
    } = useOverlays(DEFAULT_OVERLAYS);
    // DEFAULT_OVERLAYS
    // Video player controls and state
    const { isPlaying, currentFrame, playerRef, togglePlayPause, formatTime } =
        useVideoPlayer();

    // Composition duration calculations
    const { durationInFrames, durationInSeconds } =
        useCompositionDuration(overlays);

    // Aspect ratio and player dimension management
    const {
        aspectRatio,
        setAspectRatio,
        playerDimensions,
        updatePlayerDimensions,
        getAspectRatioDimensions,
    } = useAspectRatio();

    // Event handlers
    const handleOverlayChange = (updatedOverlay: Overlay) => {
        changeOverlay(updatedOverlay.id, () => updatedOverlay);
    };

    const { width: compositionWidth, height: compositionHeight } =
        getAspectRatioDimensions();

    const handleTimelineClick = useTimelineClick(playerRef, durationInFrames);

    const inputProps = {
        overlays,
        durationInFrames,
        fps: FPS,
        width: compositionWidth,
        height: compositionHeight,
        src: "",
    };

    const { renderMedia, state } = useRendering(
        "TestComponent",
        inputProps,
        RENDER_TYPE
    );

    // Replace history management code with hook
    const { undo, redo, canUndo, canRedo } = useHistory(overlays, setOverlays);

    // Create the editor state object to be saved
    // const editorState = {
    //     overlays,
    //     aspectRatio,
    //     playerDimensions,
    // };

    // // Implment load state
    // const { saveState, loadState } = useAutosave("projectId", editorState, {
    //     interval: AUTO_SAVE_INTERVAL,
    //     onSave: () => {
    //         setIsSaving(false);
    //         setLastSaveTime(Date.now());
    //     },
    //     onLoad: (loadedState) => {
    //         console.log("loadedState", loadedState);
    //         if (loadedState) {
    //             // Apply loaded state to editor
    //             setOverlays(loadedState.overlays || []);
    //             if (loadedState.aspectRatio) setAspectRatio(loadedState.aspectRatio);
    //             if (loadedState.playerDimensions)
    //                 updatePlayerDimensions(
    //                     loadedState.playerDimensions.width,
    //                     loadedState.playerDimensions.height
    //                 );
    //         }
    //     },
    //     onAutosaveDetected: (timestamp: any) => {
    //         // Only show recovery dialog on initial load, not during an active session
    //         if (!initialLoadComplete) {
    //             setAutosaveTimestamp(timestamp);
    //             setShowRecoveryDialog(true);
    //         }
    //     },
    // });

    // // Mark initial load as complete after component mounts
    // useEffect(() => {
    //     setInitialLoadComplete(true);
    // }, []);

    // console.log("DEBUG: overlays", overlays);
    // // Handle recovery dialog actions
    // const handleRecoverAutosave = async () => {
    //     const loadedState = await loadState();
    //     console.log("loadedState", loadedState);
    //     setShowRecoveryDialog(false);
    // };

    // const handleDiscardAutosave = () => {
    //     setShowRecoveryDialog(false);
    // };

    // // Manual save function for use in keyboard shortcuts or save button
    // const handleManualSave = async () => {
    //     setIsSaving(true);
    //     await saveState();
    // };

    // // Set up keyboard shortcut for manual save (Ctrl+S)
    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    //             e.preventDefault();
    //             handleManualSave();
    //         }
    //     };

    //     window.addEventListener("keydown", handleKeyDown);
    //     return () => window.removeEventListener("keydown", handleKeyDown);
    // }, [editorState]);

    // Combine all editor context values
    const editorContextValue = {
        // Overlay management
        overlays,
        setOverlays,
        selectedOverlayId,
        setSelectedOverlayId,
        changeOverlay,
        handleOverlayChange,
        addOverlay,
        deleteOverlay,
        duplicateOverlay,
        splitOverlay,
        resetOverlays,

        // Player controls
        isPlaying,
        currentFrame,
        playerRef,
        togglePlayPause,
        formatTime,
        handleTimelineClick,
        playbackRate,
        setPlaybackRate,

        // Dimensions and duration
        aspectRatio,
        setAspectRatio,
        playerDimensions,
        updatePlayerDimensions,
        getAspectRatioDimensions,
        durationInFrames,
        durationInSeconds,

        // Add renderType to the context
        renderType: RENDER_TYPE,
        renderMedia,
        state,

        deleteOverlaysByRow,

        // History management
        undo,
        redo,
        canUndo,
        canRedo,

        // New style management
        updateOverlayStyles,

        // Autosave
        // saveProject: () => console.log("saved"),
    };











    // const [overlays, setOverlays] = useState([])
    // const [playerDimensions, setPlayerDimensions] = useState({
    //     width: 1280,
    //     height: 720
    // })
    // const [aspectRatio] = useState(16 / 9)

    // const updatePlayerDimensions = useCallback((width: number, height: number) => {
    //     setPlayerDimensions({ width, height })
    // }, [])
    // const getAspectRatioDimensions = () => {
    //     const containerWidth = playerDimensions.width;
    //     const containerHeight = playerDimensions.height;

    //     let width = containerWidth;
    //     let height = width / aspectRatio;

    //     if (height > containerHeight) {
    //         height = containerHeight;
    //         width = height * aspectRatio
    //     }
    //     return { width, height }
    // }
    // const editorContextValue: any = {
    //     overlays,
    //     setOverlays,

    //     state: {},
    //     getAspectRatioDimensions,
    //     playerDimensions,

    //     durationInFrames: 300,
    //     durationInSeconds: 10,
    //     updatePlayerDimensions,
    //     formatTime: (frame: number) => `${frame}f`,
    //     saveProject: () => {
    //         console.log(" changes is saved ")
    //     }

    // }

    return (
        <UISidebarProvider>
            <EditorSidebarProvider>
                <AssetLoadingProvider>
                    <TimelineProvider>
                        <KeyframeProvider>
                            <EditorProvider value={editorContextValue}>
                                <LocalMediaProvider>
                                    <AppSidebar />
                                    <div className='w-full'>
                                        <Editor />
                                    </div>
                                </LocalMediaProvider>
                            </EditorProvider>
                        </KeyframeProvider>
                    </TimelineProvider>
                </AssetLoadingProvider>
            </EditorSidebarProvider>
        </UISidebarProvider>
    )
}

export default RemotionEditor