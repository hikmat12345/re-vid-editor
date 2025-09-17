"use client"
import { Editor } from '@/components/editor/version-7.0.0/components/core/editor'
import { AssetLoadingProvider } from '@/components/editor/version-7.0.0/contexts/asset-loading-context'
import { EditorProvider } from '@/components/editor/version-7.0.0/contexts/editor-context'
import { KeyframeProvider } from '@/components/editor/version-7.0.0/contexts/keyframe-context'
import { TimelineProvider } from '@/components/editor/version-7.0.0/contexts/timeline-context'
import { SidebarInset, SidebarProvider as UISidebarProvider } from '@/components/ui/sidebar'
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
import { AutosaveStatus } from '@/components/editor/version-7.0.0/components/autosave/autosave-status'
import { AutosaveRecoveryDialog } from '@/components/editor/version-7.0.0/components/autosave/autosave-recovery-dialog'

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
        resetOverlays,
    } = useOverlays(DEFAULT_OVERLAYS)
    const handleOverlayChange = (updatedOverlay: Overlay) => {
        changeOverlay(updatedOverlay.id, () => updatedOverlay);
    };
    const { isPlaying, currentFrame, playerRef, togglePlayPause, formatTime } =
        useVideoPlayer();

    const {
        aspectRatio,
        setAspectRatio,
        playerDimensions,
        updatePlayerDimensions,
        getAspectRatioDimensions,
    } = useAspectRatio()

    const { durationInFrames, durationInSeconds } =
        useCompositionDuration(overlays);

    const handleTimelineClick = useTimelineClick(playerRef, durationInFrames);
    const { undo, redo, canUndo, canRedo } = useHistory(overlays, setOverlays);


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
        handleOverlayChange,
        resetOverlays,


        isPlaying, currentFrame, playerRef, togglePlayPause, formatTime,

        aspectRatio,
        setAspectRatio,
        playerDimensions,
        updatePlayerDimensions,
        getAspectRatioDimensions,



        durationInFrames, durationInSeconds,
        handleTimelineClick,
        state: {},

        undo, redo, canUndo, canRedo,

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
                                    <AppSidebar />
                                    <SidebarInset>
                                        <Editor />
                                    </SidebarInset>
                                </LocalMediaProvider>
                            </EditorProvider>
                        </TimelineProvider>
                    </KeyframeProvider>
                </AssetLoadingProvider>
            </EditorSidebarProvider>
        </UISidebarProvider >
    );
}

export default RemotionEditor