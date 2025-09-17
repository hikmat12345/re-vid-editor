"use client";

import { useState, useCallback } from "react";
import { SidebarProvider as UISidebarProvider } from "@/components/ui/sidebar";
import { SidebarProvider as EditorSidebarProvider } from "@/components/editor/version-7.0.0/contexts/sidebar-context";
import { TimelineProvider } from "@/components/editor/version-7.0.0/contexts/timeline-context";
import { EditorProvider } from "@/components/editor/version-7.0.0/contexts/editor-context";
import { KeyframeProvider } from "@/components/editor/version-7.0.0/contexts/keyframe-context"; // ✅ add this
import { AssetLoadingProvider } from "@/components/editor/version-7.0.0/contexts/asset-loading-context";
import { AppSidebar } from "@/components/editor/version-7.0.0/components/sidebar/app-sidebar";
import { Editor } from "@/components/editor/version-7.0.0/components/core/editor";


export default function page() {
    const [overlays, setOverlays] = useState<any[]>([]);



    const [playerDimensions, setPlayerDimensions] = useState({
        width: 1280,
        height: 720,
    });

    const [aspectRatio] = useState(16 / 9);
    const getAspectRatioDimensions = () => {
        const containerWidth = playerDimensions.width;
        const containerHeight = playerDimensions.height;

        let width = containerWidth;
        let height = width / aspectRatio;

        if (height > containerHeight) {
            height = containerHeight;
            width = height * aspectRatio;
        }

        return { width, height };
    }


    const updatePlayerDimensions = useCallback((width: number, height: number) => {
        setPlayerDimensions({ width, height });
    }, []);




    const editorContextValue: any = {
        // sidebar 
        overlays,
        setOverlays,


        // header 
        state: {},

        // for editor 
        getAspectRatioDimensions,
        playerDimensions,
        updatePlayerDimensions,
        durationInFrames: 300,
        durationInSeconds: 10,
        formatTime: (frame: number) => `${frame}f`,

    };
    return (
        <UISidebarProvider>
            <EditorSidebarProvider>
                <AssetLoadingProvider>
                    <TimelineProvider>
                        <KeyframeProvider>
                            <EditorProvider value={editorContextValue}>
                                <AppSidebar />
                                <div className="w-full">
                                    <Editor />
                                </div>
                            </EditorProvider>
                        </KeyframeProvider>
                    </TimelineProvider>
                </AssetLoadingProvider>
            </EditorSidebarProvider>
        </UISidebarProvider>
    )
}
