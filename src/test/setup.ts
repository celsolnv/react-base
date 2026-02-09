/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, vi } from "vitest";

import "@testing-library/jest-dom";

// Make vi available globally
globalThis.vi = vi;

// Run cleanup after each test to avoid memory leaks
// Mock for matchMedia
beforeAll(() => {
  // Mock matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock hasPointerCapture
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = vi.fn(() => false);
  }

  // Mock pointer events for jsdom
  // Create a proper mock for PointerEvent with TypeScript interfaces
  class MockPointerEvent extends Event {
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;
    height: number;
    width: number;
    pressure: number;
    tangentialPressure: number;
    tiltX: number;
    tiltY: number;
    twist: number;
    clientX: number;
    clientY: number;
    screenX: number;
    screenY: number;

    constructor(type: string, props?: any) {
      super(type, props);
      this.pointerId = props?.pointerId || 0;
      this.pointerType = props?.pointerType || "mouse";
      this.isPrimary = props?.isPrimary || false;
      this.height = props?.height || 0;
      this.width = props?.width || 0;
      this.pressure = props?.pressure || 0;
      this.tangentialPressure = props?.tangentialPressure || 0;
      this.tiltX = props?.tiltX || 0;
      this.tiltY = props?.tiltY || 0;
      this.twist = props?.twist || 0;
      this.clientX = props?.clientX || 0;
      this.clientY = props?.clientY || 0;
      this.screenX = props?.screenX || 0;
      this.screenY = props?.screenY || 0;
    }
  }

  // Assign the mock to global
  global.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {
      /* document why this method 'observe' is empty */
    }
    unobserve() {
      /* document why this method 'unobserve' is empty */
    }
    disconnect() {
      /* document why this method 'disconnect' is empty */
    }
  } as unknown as typeof ResizeObserver;

  // Mock scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();
});
