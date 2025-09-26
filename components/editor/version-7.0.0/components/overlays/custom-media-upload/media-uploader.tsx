import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, AudioLines } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { useEditorContext } from '../../../contexts/editor-context'
import { OverlayType } from '../../../types'
import { useTimelinePositioning } from '../../../hooks/use-timeline-positioning'
import { useTimeline } from '../../../contexts/timeline-context'
import { useLocalMedia } from '../../../contexts/local-media-context'

export default function MediaUploader() {
    const {
        addOverlay,
        overlays,
        durationInFrames
    } = useEditorContext()
    const { findNextAvailablePosition } = useTimelinePositioning()
    const { visibleRows } = useTimeline()
    const { addMediaFile, isLoading } = useLocalMedia()

    const [text, setText] = useState("hello")
    const [transcriptionLoading, setTranscriptionLoading] = useState(false)
    const [transcriptionError, setTranscriptionError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const audioInputRef = useRef<HTMLInputElement>(null)

    const { from, row } = findNextAvailablePosition(
        overlays,
        visibleRows,
        durationInFrames
    )

    // Handle text overlay creation
    const handleAddTextToTimeline = (): void => {
        console.log("Adding text to timeline")
        const newTextOverlay: any = {
            id: Date.now(),
            type: OverlayType.TEXT,
            content: text,
            src: "",
            from: from,
            row: row,
            left: 0,
            top: 0,
            width: 1920,
            height: 100,
            rotation: 0,
            isDragging: false,
            durationInFrames: 80,
            styles: {
                opacity: 1,
            },
        }
        addOverlay(newTextOverlay)
    }

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files || files.length === 0) return

        Array.from(files).forEach(async (file) => {
            try {
                // Validate file type
                const isImage = file.type.startsWith('image/')
                const isAudio = file.type.startsWith('audio/')

                if (!isImage && !isAudio) {
                    console.error('Only image and audio files are supported')
                    return
                }

                // Create object URL for the file
                const fileUrl = URL.createObjectURL(file)

                // Add to local media context if available
                if (addMediaFile) {
                    await addMediaFile(file)
                }

                // Get duration for audio files
                let durationInFrames = 80 // default duration
                if (isAudio) {
                    durationInFrames = await getAudioDuration(file) * 30 // Convert to frames (30fps)
                }

                // Find next available position
                const { from: nextFrom, row: nextRow } = findNextAvailablePosition(
                    overlays,
                    visibleRows,
                    durationInFrames
                )

                // Create appropriate overlay based on file type
                const newOverlay: any = {
                    id: Date.now() + Math.random(), // Ensure unique ID
                    type: isImage ? OverlayType.IMAGE : OverlayType.SOUND,
                    content: file.name,
                    src: fileUrl,
                    from: nextFrom,
                    row: nextRow,
                    left: 0,
                    top: 0,
                    width: isImage ? 1920 : 1920,
                    height: isImage ? 1080 : 100,
                    rotation: 0,
                    isDragging: false,
                    durationInFrames,
                    styles: {
                        opacity: 1,
                    },
                }

                addOverlay(newOverlay)
                console.log(`Added ${isImage ? 'image' : 'audio'} to timeline:`, file.name)

            } catch (error) {
                console.error('Error uploading file:', error)
            }
        })

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Handle audio transcription
    const handleTranscribeAudio = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files || files.length === 0) return

        setTranscriptionLoading(true)
        setTranscriptionError("")

        try {
            const file = files[0]

            // Validate it's an audio file
            if (!file.type.startsWith('audio/')) {
                setTranscriptionError('Please select an audio file for transcription')
                return
            }

            // Create FormData and upload file
            const formData = new FormData()
            formData.append('audio', file)

            const response = await fetch('/api/latest/transcribe', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Transcription failed')
            }

            const result = await response.json()
            const { from, row } = findNextAvailablePosition(
                overlays,
                visibleRows,
                durationInFrames
            )
            console.log(durationInFrames, 'fromfromfromfromfrom')
            if (result.success && result.audioToText) {

                const chunkSize = Math.ceil(result.audioToText.length / 3)
                const arr1 = result.audioToText.slice(0, chunkSize)
                const arr2 = result.audioToText.slice(chunkSize, chunkSize * 2)
                const arr3 = result.audioToText.slice(chunkSize * 2);
                const arrayOfText = [arr1, arr2, arr3]
                let findFrom = from
                for (const snipet of arrayOfText) {
                    console.log(snipet)

                    const captionOverlay: any = {
                        id: Date.now(),
                        type: OverlayType.TEXT,
                        content: snipet.join(" "),
                        src: "",
                        from: findFrom,
                        row: row, // use the row computed by timeline
                        left: 24,
                        top: 580,
                        width: 1920,
                        height: 100,
                        rotation: 0,
                        isDragging: true,
                        durationInFrames: durationInFrames / 3,
                        styles: {
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "rgba(255, 169, 2, 1)",
                            backgroundColor: "",
                            fontFamily: "font-league-spartan",
                            fontStyle: "normal",
                            textDecoration: "none",
                            lineHeight: "1.1",
                            letterSpacing: "-0.03em",
                            opacity: 1,
                            zIndex: 1,
                            transform: "none",
                        },
                    };
                    findFrom = findFrom + from
                    addOverlay(captionOverlay);
                }
            }


        } catch (error) {
            console.error('Transcription error:', error)
            setTranscriptionError(error instanceof Error ? error.message : 'Transcription failed')
        } finally {
            setTranscriptionLoading(false)
            if (audioInputRef.current) {
                audioInputRef.current.value = ''
            }
        }
    }

    // Helper function to get audio duration
    const getAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const audio = new Audio()
            audio.onloadedmetadata = () => {
                resolve(audio.duration || 3) // Default to 3 seconds if duration can't be determined
            }
            audio.onerror = () => {
                resolve(3) // Default duration on error
            }
            audio.src = URL.createObjectURL(file)
        })
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleTranscribeClick = () => {
        audioInputRef.current?.click()
    }

    return (
        <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900/50 h-full">
            {/* Text Input Section */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Add Text</label>
                <Input
                    placeholder="Enter your text..."
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-400"
                    style={{ fontSize: "16px" }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button
                    className="w-full bg-background hover:bg-muted text-foreground border-border"
                    onClick={handleAddTextToTimeline}
                >
                    Add Text to Timeline
                </Button>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Upload Media</label>
                <Button
                    className="w-full bg-background hover:bg-muted text-foreground border-border flex items-center gap-2"
                    onClick={handleUploadClick}
                    disabled={isLoading}
                >
                    <Upload className="w-4 h-4" />
                    {isLoading ? 'Uploading...' : 'Upload Image or Audio'}
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,audio/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                    Supports: Images (PNG, JPG, GIF, etc.) and Audio (MP3, WAV, etc.)
                </p>
            </div>

            {/* Audio Transcription Section */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Transcribe Audio</label>
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-700 flex items-center gap-2"
                    onClick={handleTranscribeClick}
                    disabled={transcriptionLoading}
                >
                    <AudioLines className="w-4 h-4" />
                    {transcriptionLoading ? 'Transcribing...' : 'Transcribe Audio to Text'}
                </Button>
                <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleTranscribeAudio}
                    className="hidden"
                />

                {transcriptionError && (
                    <p className="text-xs text-red-500">{transcriptionError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Upload audio to generate timed text captions automatically
                </p>
            </div>

            {/* Transcription Info */}
            {transcriptionLoading && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Transcribing audio... This may take a few moments.
                    </p>
                </div>
            )}
        </div>
    )
}







// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Upload } from 'lucide-react'
// import React, { useState, useRef } from 'react'
// import { useEditorContext } from '../../../contexts/editor-context'
// import { OverlayType } from '../../../types'
// import { useTimelinePositioning } from '../../../hooks/use-timeline-positioning'
// import { useTimeline } from '../../../contexts/timeline-context'
// import { useLocalMedia } from '../../../contexts/local-media-context'

// export default function MediaUploader() {
//     const {
//         addOverlay,
//         overlays,
//         durationInFrames
//     } = useEditorContext()
//     const { findNextAvailablePosition } = useTimelinePositioning()
//     const { visibleRows } = useTimeline()
//     const { addMediaFile, isLoading } = useLocalMedia()

//     const [text, setText] = useState("hello")
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     const { from, row } = findNextAvailablePosition(
//         overlays,
//         visibleRows,
//         durationInFrames
//     )

//     // Handle text overlay creation
//     const handleAddTextToTimeline = (): void => {
//         console.log("Adding text to timeline")
//         const newTextOverlay: any = {
//             id: Date.now(),
//             type: OverlayType.TEXT,
//             content: text,
//             src: "",
//             from: from,
//             row: row,
//             left: 0,
//             top: 0,
//             width: 1920,
//             height: 100,
//             rotation: 0,
//             isDragging: false,
//             durationInFrames: 80,
//             styles: {
//                 opacity: 1,
//             },
//         }
//         addOverlay(newTextOverlay)
//     }

//     // Handle file upload
//     const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files
//         if (!files || files.length === 0) return

//         Array.from(files).forEach(async (file) => {
//             try {
//                 // Validate file type
//                 const isImage = file.type.startsWith('image/')
//                 const isAudio = file.type.startsWith('audio/')

//                 if (!isImage && !isAudio) {
//                     console.error('Only image and audio files are supported')
//                     return
//                 }

//                 // Create object URL for the file
//                 const fileUrl = URL.createObjectURL(file)

//                 // Add to local media context if available
//                 if (addMediaFile) {
//                     await addMediaFile(file)
//                 }

//                 // Get duration for audio files
//                 let durationInFrames = 80 // default duration
//                 if (isAudio) {
//                     durationInFrames = await getAudioDuration(file) * 30 // Convert to frames (30fps)
//                 }

//                 // Find next available position
//                 const { from: nextFrom, row: nextRow } = findNextAvailablePosition(
//                     overlays,
//                     visibleRows,
//                     durationInFrames
//                 )

//                 // Create appropriate overlay based on file type
//                 const newOverlay: any = {
//                     id: Date.now() + Math.random(), // Ensure unique ID
//                     type: isImage ? OverlayType.IMAGE : OverlayType.SOUND,
//                     content: file.name,
//                     src: fileUrl,
//                     from: nextFrom,
//                     row: nextRow,
//                     left: 0,
//                     top: 0,
//                     width: isImage ? 1920 : 1920,
//                     height: isImage ? 1080 : 100,
//                     rotation: 0,
//                     isDragging: false,
//                     durationInFrames,
//                     styles: {
//                         opacity: 1,
//                     },
//                 }

//                 addOverlay(newOverlay)
//                 console.log(`Added ${isImage ? 'image' : 'audio'} to timeline:`, file.name)

//             } catch (error) {
//                 console.error('Error uploading file:', error)
//             }
//         })

//         // Reset file input
//         if (fileInputRef.current) {
//             fileInputRef.current.value = ''
//         }
//     }

//     // Helper function to get audio duration
//     const getAudioDuration = (file: File): Promise<number> => {
//         return new Promise((resolve) => {
//             const audio = new Audio()
//             audio.onloadedmetadata = () => {
//                 resolve(audio.duration || 3) // Default to 3 seconds if duration can't be determined
//             }
//             audio.onerror = () => {
//                 resolve(3) // Default duration on error
//             }
//             audio.src = URL.createObjectURL(file)
//         })
//     }

//     const handleUploadClick = () => {
//         fileInputRef.current?.click()
//     }

//     return (
//         <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900/50 h-full">
//             {/* Text Input Section */}
//             <div className="space-y-2">
//                 <label className="text-sm font-medium text-foreground">Add Text</label>
//                 <Input
//                     placeholder="Enter your text..."
//                     className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-400"
//                     style={{ fontSize: "16px" }}
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                 />
//                 <Button
//                     className="w-full bg-background hover:bg-muted text-foreground border-border"
//                     onClick={handleAddTextToTimeline}
//                 >
//                     Add Text to Timeline
//                 </Button>
//             </div>

//             {/* File Upload Section */}
//             <div className="space-y-2">
//                 <label className="text-sm font-medium text-foreground">Upload Media</label>
//                 <Button
//                     className="w-full bg-background hover:bg-muted text-foreground border-border flex items-center gap-2"
//                     onClick={handleUploadClick}
//                     disabled={isLoading}
//                 >
//                     <Upload className="w-4 h-4" />
//                     {isLoading ? 'Uploading...' : 'Upload Image or Audio'}
//                 </Button>
//                 <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*,audio/*"
//                     multiple
//                     onChange={handleFileUpload}
//                     className="hidden"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                     Supports: Images (PNG, JPG, GIF, etc.) and Audio (MP3, WAV, etc.)
//                 </p>
//             </div>
//         </div>
//     )
// }