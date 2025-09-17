import ReactVideoEditor from "@/components/editor/version-7.0.0/react-video-editor";
import Navbar from "@/components/shared/navbar";
import VersionChangeLog from "@/components/shared/version-change-log";

export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-gray-900 via-gray-900 to-blue-900/30 relative overflow-hidden min-h-screen">

      Go to /remotion-editor page
    </div>
  );
}



// "use client"
// import { Editor } from '@/components/editor/version-7.0.0/components/core/editor'
// import { AssetLoadingProvider } from '@/components/editor/version-7.0.0/contexts/asset-loading-context'
// import { EditorProvider } from '@/components/editor/version-7.0.0/contexts/editor-context'
// import { KeyframeProvider } from '@/components/editor/version-7.0.0/contexts/keyframe-context'
// import { TimelineProvider } from '@/components/editor/version-7.0.0/contexts/timeline-context'
// import { SidebarInset, SidebarProvider as UISidebarProvider } from '@/components/ui/sidebar'
// import { SidebarProvider as EditorSidebarProvider } from '@/components/editor/version-7.0.0/contexts/sidebar-context'
// import React, { useCallback, useEffect, useState } from 'react'
// import { AppSidebar } from '@/components/editor/version-7.0.0/components/sidebar/app-sidebar'
// import { useOverlays } from '@/components/editor/version-7.0.0/hooks/use-overlays'
// import { AUTO_SAVE_INTERVAL, DEFAULT_OVERLAYS, FPS, RENDER_TYPE } from '@/components/editor/version-7.0.0/constants'
// import { useVideoPlayer } from '@/components/editor/version-7.0.0/hooks/use-video-player'
// import { useCompositionDuration } from '@/components/editor/version-7.0.0/hooks/use-composition-duration'
// import { useAspectRatio } from '@/components/editor/version-7.0.0/hooks/use-aspect-ratio'
// import { Overlay } from '@/components/editor/version-7.0.0/types'
// import { useTimelineClick } from '@/components/editor/version-7.0.0/hooks/use-timeline-click'
// import { useRendering } from '@/components/editor/version-7.0.0/hooks/use-rendering'
// import { useHistory } from '@/components/editor/version-7.0.0/hooks/use-history'
// import { useAutosave } from '@/components/editor/version-7.0.0/hooks/use-autosave'
// import { LocalMediaProvider } from '@/components/editor/version-7.0.0/contexts/local-media-context'
// import { AutosaveStatus } from '@/components/editor/version-7.0.0/components/autosave/autosave-status'
// import { AutosaveRecoveryDialog } from '@/components/editor/version-7.0.0/components/autosave/autosave-recovery-dialog'

// function RemotionEditor() {
//     const [overlays, setOverlays] = useState([])
//     const [playerDimensions, setPlayerDimensions] = useState({
//         width: 1280,
//         height: 720
//     })
//     const [aspectRatio] = useState(16 / 9)

//     const updatePlayerDimensions = useCallback((width: number, height: number) => {
//         setPlayerDimensions({ width, height })
//     }, [])
//     const getAspectRatioDimensions = () => {
//         const containerWidth = playerDimensions.width;
//         const containerHeight = playerDimensions.height;

//         let width = containerWidth;
//         let height = width / aspectRatio;

//         if (height > containerHeight) {
//             height = containerHeight;
//             width = height * aspectRatio
//         }
//         return { width, height }
//     }
//     const editorContextValue: any = {
//         overlays,
//         setOverlays,

//         state: {},
//         getAspectRatioDimensions,
//         playerDimensions,

//         durationInFrames: 300,
//         durationInSeconds: 10,
//         updatePlayerDimensions,
//         formatTime: (frame: number) => `${frame}f`,
//         saveProject: () => {
//             console.log(" changes is saved ")
//         }

//     }

//     return (
//         <UISidebarProvider>
//             <EditorSidebarProvider>
//                 <AssetLoadingProvider>
//                     <KeyframeProvider>
//                         <TimelineProvider>
//                             <EditorProvider value={editorContextValue}>
//                                 <AppSidebar />
//                                 <div className='w-full'>
//                                     <Editor />
//                                 </div>
//                             </EditorProvider>
//                         </TimelineProvider>
//                     </KeyframeProvider>
//                 </AssetLoadingProvider>
//             </EditorSidebarProvider>
//         </UISidebarProvider>
//     );
// }

// export default RemotionEditor