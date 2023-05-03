import { Component, EventEmitter, HostListener, Inject, Input, OnChanges, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { ImageViewerConfig } from './models/image-viewer-config.model';
import { CustomImageEvent } from './models/custom-image-event-model';
import { DomSanitizer } from '@angular/platform-browser';

const DEFAULT_CONFIG: ImageViewerConfig = {
  btnClass: "default",
  zoomFactor: 0.1,
  containerBackgroundColor: "#ccc",
  wheelZoom: false,
  allowFullscreen: true,
  allowKeyboardNavigation: true,
  btnShow: {
    zoomIn: true,
    zoomOut: true,
    rotateClockwise: true,
    rotateCounterClockwise: true,
    next: true,
    prev: true,
  },
  btnIcons: {
    zoomIn: "fa-solid fa-plus",
    zoomOut: "fa-solid fa-minus",
    rotateClockwise: "fa-solid fa-arrow-rotate-right",
    rotateCounterClockwise: "fa-solid fa-arrow-rotate-left",
    next: "fa-solid fa-arrow-right",
    prev: "fa-solid fa-arrow-left",
    fullscreen: "fa-solid fa-up-right-and-down-left-from-center",
    menu: 'fa-solid fa-ellipsis-vertical'
  },
};

@Component({
  selector: 'angular-11-image-viewer',
  templateUrl: './angular-image-viewer.component.html',
  styleUrls: ['./angular-image-viewer.component.scss']
})
export class AngularImageViewerComponent implements OnInit, OnChanges {
  @Input()
  src!: string[];

  @Input()
  screenHeightOccupied!: 0; // In Px

  @Input()
  index = 0;

  @Input()
  config!: ImageViewerConfig;

  @Output()
  indexChange: EventEmitter<number> = new EventEmitter();

  @Output()
  configChange: EventEmitter<ImageViewerConfig> = new EventEmitter();

  @Output()
  customImageEvent: EventEmitter<CustomImageEvent> = new EventEmitter();
  
  @Output()
  delete: EventEmitter<any> = new EventEmitter();

  @Output()
  view: EventEmitter<any> = new EventEmitter();

  @Output()
  replace: EventEmitter<any> = new EventEmitter();

  styleHeight = "98vh";

  public style = {
    transform: "",
    msTransform: "",
    oTransform: "",
    webkitTransform: "",
  };
  public showButtons: boolean = false;
  public fullscreen = false;
  private scale = 1;
  private rotation = 0;
  private translateX = 0;
  private translateY = 0;
  private prevX!: number;
  private prevY!: number;
  private hovered = false;
  public hidebutton = false

  constructor(
    @Optional() @Inject("config") public moduleConfig: ImageViewerConfig,
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['screenHeightOccupied']) {
      this.styleHeight = "calc(98vh - " + this.screenHeightOccupied + "px)";
    }
  }

  ngOnInit() {
    const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
    this.config = this.mergeConfig(merged, this.config);
    this.triggerConfigBinding();
  }

  @HostListener("window:keyup.ArrowRight", ["$event"])
  nextImage(event:any) {
    if (this.canNavigate(event) && this.index < this.src.length - 1) {
      this.index++;
      this.triggerIndexBinding();
      this.reset();
    }
  }

  @HostListener("window:keyup.ArrowLeft", ["$event"])
  prevImage(event:any) {
    if (this.canNavigate(event) && this.index > 0) {
      this.index--;
      this.triggerIndexBinding();
      this.reset();
    }
  }

  zoomIn() {
    if(this.config.zoomFactor != undefined){
    this.scale *= 1 + this.config.zoomFactor;
    }
    this.updateStyle();
  }

  zoomOut() {
    if(this.config.zoomFactor != undefined){
    if (this.scale > this.config.zoomFactor) {
      this.scale /= 1 + this.config.zoomFactor;
    }
  }
    this.updateStyle();

  }

  scrollZoom(evt:any) {
    if (this.config.wheelZoom) {
      evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
      return false;
    }else{
      return true;
    }
    
  }

  rotateClockwise() {
    this.rotation += 90;
    this.updateStyle();
  }

  rotateCounterClockwise() {
    this.rotation -= 90;
    this.updateStyle();
  }

  onLoad(url:any) {
    setInterval(() => {
      this.showButtons = true;
    }, 700);
  }

  onLoadStart(url:any) {
    // this.showButtons = false
  }

  onLoadEnd(url:any) {
    // this.showButtons = true;
  }

  imageNotFound(url:any) {
    // this.showButtons = false
  }

  onDragOver(evt:any) {
    this.translateX += evt.clientX - this.prevX;
    this.translateY += evt.clientY - this.prevY;
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
    this.updateStyle();
  }

  onDragStart(evt:any) {
    if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
      evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
    }
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
  }

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    if (!this.fullscreen) {
      this.reset();
    }
  }

  triggerIndexBinding() {
    this.indexChange.emit(this.index);
  }

  triggerConfigBinding() {
    this.configChange.next(this.config);
  }

  fireCustomEvent(name:any, imageIndex:any) {
    this.customImageEvent.emit(new CustomImageEvent(name, imageIndex));
  }

  reset() {
    this.scale = 1;
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.updateStyle();
  }

  @HostListener("mouseover")
  onMouseOver() {
    this.hovered = true;
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.hovered = false;
  }

  viewFile(){
    this.view.emit(true);
  }

  deleteFile(){
    this.delete.emit(true);
  }

  replaceFile(){
    this.replace.emit(true);
  }

  private canNavigate(event: any) {
    return (
      event == null || (this.config.allowKeyboardNavigation && this.hovered)
    );
  }

  private updateStyle() {
    this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    this.style.msTransform = this.style.transform;
    this.style.webkitTransform = this.style.transform;
    this.style.oTransform = this.style.transform;
  }

  private mergeConfig(
    defaultValues: ImageViewerConfig,
    overrideValues: ImageViewerConfig
  ): ImageViewerConfig {
    let result: ImageViewerConfig = { ...defaultValues };
    if (overrideValues) {
      result = { ...defaultValues, ...overrideValues };

      if (overrideValues.btnIcons) {
        result.btnIcons = {
          ...defaultValues.btnIcons,
          ...overrideValues.btnIcons,
        };
      }
    }
    return result;
  }
}
