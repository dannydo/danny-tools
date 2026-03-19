import Cocoa

class AppDelegate: NSObject, NSApplicationDelegate {
    var separatorItems: [NSStatusItem] = []
    
    // Nudge the baseline up by 1 point to keep it perfectly centered
    let dotAttributes: [NSAttributedString.Key: Any] = [
        .font: NSFont.systemFont(ofSize: 11, weight: .black),
        .foregroundColor: NSColor.labelColor.withAlphaComponent(0.05), // 5% Opacity
        .baselineOffset: 1.0 
    ]

    var activeClickedItem: NSStatusItem?

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        var dotCount = UserDefaults.standard.integer(forKey: "DotCount")
        if dotCount <= 0 { dotCount = 4 } // Fallback to 4 dots
        UserDefaults.standard.set(dotCount, forKey: "DotCount")
        
        initializeDots(count: dotCount)
    }

    func initializeDots(count: Int) {
        if count <= 0 { return }
        for i in 1...count {
            createSingleDot(index: i)
        }
    }

    func createSingleDot(index: Int) {
        let item = NSStatusBar.system.statusItem(withLength: 6)
        item.autosaveName = "MenuBarDotSeparator_\(index)"
        if let btn = item.button {
            btn.attributedTitle = NSAttributedString(string: "•", attributes: dotAttributes)
            
            // Hook up right-click action
            btn.target = self
            btn.action = #selector(handleRightClick(_:))
            btn.sendAction(on: [.rightMouseUp])
        }
        separatorItems.append(item)
    }

    @objc func handleRightClick(_ sender: NSStatusBarButton) {
        // Track which dot we are right-clicking to remove directly
        activeClickedItem = separatorItems.first(where: { $0.button == sender })
        
        let menu = NSMenu()
        menu.addItem(withTitle: "+ Add Dot", action: #selector(addDot), keyEquivalent: "")
        menu.addItem(withTitle: "- Remove This Dot", action: #selector(removeDot), keyEquivalent: "")
        menu.addItem(NSMenuItem.separator())
        menu.addItem(withTitle: "Quit", action: #selector(quitApp), keyEquivalent: "")
        
        // Present the menu anchored to the button that was clicked
        menu.popUp(positioning: nil, at: NSPoint(x: 0, y: sender.bounds.height + 5), in: sender)
    }

    @objc func addDot() {
        let currentCount = UserDefaults.standard.integer(forKey: "DotCount")
        UserDefaults.standard.set(currentCount + 1, forKey: "DotCount")
        
        // Find the absolute highest index we've used so far to create a unique autosave name
        let maxIndex = separatorItems.compactMap { 
            Int($0.autosaveName.replacingOccurrences(of: "MenuBarDotSeparator_", with: "")) 
        }.max() ?? 0
        
        createSingleDot(index: maxIndex + 1)
    }

    @objc func removeDot() {
        let currentCount = UserDefaults.standard.integer(forKey: "DotCount")
        if currentCount > 1, let itemToRemove = activeClickedItem {
            UserDefaults.standard.set(currentCount - 1, forKey: "DotCount")
            
            // Remove from the menu bar
            NSStatusBar.system.removeStatusItem(itemToRemove)
            // Remove from our memory array
            separatorItems.removeAll { $0 == itemToRemove }
        }
        activeClickedItem = nil
    }

    @objc func quitApp() {
        NSApplication.shared.terminate(nil)
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let delegate = AppDelegate()
app.delegate = delegate
app.run()
