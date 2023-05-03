export interface ImageViewerConfig {
    btnClass?: string;
    zoomFactor?: number;
    containerBackgroundColor?: string;
    wheelZoom?: boolean;
    allowFullscreen?: boolean;
    allowKeyboardNavigation?: boolean;
  
    btnShow?: {
      zoomIn?: boolean;
      zoomOut?: boolean;
      rotateClockwise?: boolean;
      rotateCounterClockwise?: boolean;
      next?: boolean;
      prev?: boolean;
      menu?:boolean;
    };
  
    btnIcons?: {
      zoomIn?: string;
      zoomOut?: string;
      rotateClockwise?: string;
      rotateCounterClockwise?: string;
      next?: string;
      prev?: string;
      fullscreen?: string;
      menu: string
    };
  
    customBtns?: Array<{
      name: string;
      icon: string;
    }>;
  }
  