"use client"
import { Editor } from '@/components/editor/version-7.0.0/components/core/editor'
import { AssetLoadingProvider } from '@/components/editor/version-7.0.0/contexts/asset-loading-context'
import { EditorProvider } from '@/components/editor/version-7.0.0/contexts/editor-context'
import { KeyframeProvider } from '@/components/editor/version-7.0.0/contexts/keyframe-context'
import { TimelineProvider } from '@/components/editor/version-7.0.0/contexts/timeline-context'
import { SidebarInset, SidebarProvider as UISidebarProvider } from '@/components/ui/sidebar'
import { SidebarProvider as EditorSidebarProvider } from '@/components/editor/version-7.0.0/contexts/sidebar-context'
import React from 'react'
import { AppSidebar } from '@/components/editor/version-7.0.0/components/sidebar/app-sidebar'
import { useOverlays } from '@/components/editor/version-7.0.0/hooks/use-overlays'
import { DEFAULT_OVERLAYS, FPS, RENDER_TYPE, } from '@/components/editor/version-7.0.0/constants'
import { useVideoPlayer } from '@/components/editor/version-7.0.0/hooks/use-video-player'
import { useAspectRatio } from '@/components/editor/version-7.0.0/hooks/use-aspect-ratio'
import { Overlay } from '@/components/editor/version-7.0.0/types'
import { LocalMediaProvider } from '@/components/editor/version-7.0.0/contexts/local-media-context'
import { renderMedia } from '@remotion/renderer'
import { useCompositionDuration } from '@/components/editor/version-7.0.0/hooks/use-composition-duration'
import { useRendering } from '@/components/editor/version-7.0.0/hooks/use-rendering'
function RemotionEditor() {
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
        resetOverlays
    } = useOverlays(DEFAULT_OVERLAYS)

    const { isPlaying, currentFrame, playerRef, togglePlayPause, formatTime } = useVideoPlayer();

    // const handleTimelineClick = useTimelineClick(playerRef, durationInFrams)

    const {
        aspectRatio,
        setAspectRatio,
        playerDimensions,
        updatePlayerDimensions,
        getAspectRatioDimensions
    } = useAspectRatio()

    const handleOverlayChange = (updateOverlay: Overlay) => {
        changeOverlay(updateOverlay.id, () => updateOverlay)
    }

    const { durationInFrames } = useCompositionDuration(overlays)
    const { width: compositionWidth, height: compositionHeight } = getAspectRatioDimensions()

    const inputProps = {
        overlays,
        durationInFrames,
        fps: FPS,
        width: compositionWidth,
        height: compositionHeight,
        src: ""
    }

    const { renderMedia, state } = useRendering(
        "TestComponent",
        inputProps,
        "ssr"
    )

    const editorContextValue: any = {
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


        isPlaying, currentFrame, playerRef, togglePlayPause, formatTime,


        aspectRatio,
        setAspectRatio,
        playerDimensions,
        updatePlayerDimensions,
        getAspectRatioDimensions,

        handleOverlayChange,


        renderMedia,
        state,
        renderType: RENDER_TYPE,

        durationInFrames: 300,
        durationInSeconds: 10,
        saveProject: () => {
            console.log(" changes is saved ")
        }

    }

    return (
        <UISidebarProvider>
            <EditorSidebarProvider>
                <AssetLoadingProvider>
                    <KeyframeProvider>
                        <TimelineProvider>
                            <EditorProvider value={editorContextValue}>
                                <LocalMediaProvider>
                                    <AssetLoadingProvider>
                                        <AppSidebar />
                                        <SidebarInset>
                                            <Editor />
                                        </SidebarInset>
                                    </AssetLoadingProvider>
                                </LocalMediaProvider>
                            </EditorProvider>
                        </TimelineProvider>
                    </KeyframeProvider>
                </AssetLoadingProvider>
            </EditorSidebarProvider>
        </UISidebarProvider>
    );
}

export default RemotionEditor