import Cocoa

let text = "ↀ" as NSString
let font = NSFont.systemFont(ofSize: 800)
let attributes: [NSAttributedString.Key: Any] = [
    .font: font,
    .foregroundColor: NSColor.white
]
let textSize = text.size(withAttributes: attributes)
let imageSize = NSSize(width: 1024, height: 1024)

let image = NSImage(size: imageSize)
image.lockFocus()

// Draw a transparent background (or dark rounded rect if we want, but transparent is usually best for symbols)
NSColor.clear.set()
NSRect(origin: .zero, size: imageSize).fill()

let rect = NSRect(x: (imageSize.width - textSize.width) / 2, 
                  y: ((imageSize.height - textSize.height) / 2) - 100, // Nudge down slightly 
                  width: textSize.width, 
                  height: textSize.height)
text.draw(in: rect, withAttributes: attributes)
image.unlockFocus()

if let tiffData = image.tiffRepresentation,
   let bitmap = NSBitmapImageRep(data: tiffData),
   let pngData = bitmap.representation(using: .png, properties: [:]) {
    try? pngData.write(to: URL(fileURLWithPath: "icon_1024x1024.png"))
}
