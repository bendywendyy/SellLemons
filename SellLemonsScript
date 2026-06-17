local CalmLib = loadstring(game:HttpGet("https://raw.githubusercontent.com/IcantAffordSynapse/calmlib/refs/heads/main/src.lua"))()

local window = CalmLib:win("sub 2 vaehz")
local section1 = window:tab("Autofarm", "rbxassetid://109121102062195")
local section2 = window:tab("Settings", "rbxassetid://99579688577014")

local plr = game:GetService("Players").LocalPlayer

getgenv().farming = false
getgenv().farmsettings = {
    purchase = true,
    upgrade = true,
    collect = true,
    cashdrop = true,
    fruit = true
}

local tycoon
for _, v in pairs(workspace:GetChildren()) do
    if v.Name:find("Tycoon") and v:FindFirstChild("Owner").Value == plr then
        tycoon = v
    end
end

local suffixes = {
    K   = 1e3,
    M   = 1e6,
    B   = 1e9,
    T   = 1e12,
    Qd  = 1e15,
    Qn  = 1e18,
    Sx  = 1e21,
    Sxd = 1e21,
    Sp  = 1e24,
    Oc  = 1e27,
    No  = 1e30,
    Dc  = 1e33,
}

function decodeValue(str)
    local clean = str:gsub("[\226\128\128-\226\128\143]", "")

    local numStr, suffix = clean:match("%$([%d%,%.]+)(%a*)")
    if not numStr then
        return nil
    end

    local num = tonumber((numStr:gsub(",", "")))
    if not num then
        return nil
    end

    if suffix == "" then
        return num
    end

    local multiplier = suffixes[suffix]

    if not multiplier then
        suffix = suffix:sub(1,1):upper() .. suffix:sub(2):lower()
        multiplier = suffixes[suffix]
    end

    if multiplier then
        return num * multiplier
    end

    return num
end

local PurchasesFold = tycoon.Purchases

tycoon.Remotes.PhoneOffer.OnClientEvent:Connect(function()
    if not getgenv().farming then return end
    local Event = tycoon.Remotes.PhoneOffer
    Event:FireServer(
        "Accept"
    )
end)

section1:toggle("Autofarm", false, function(bool)
    local stands = tycoon.Values.Income.Streams
    getgenv().farming = bool
    if not getgenv().farming then return end
    task.spawn(function()
        while getgenv().farming do
            if not getgenv().farmsettings.collect then wait(1) continue end
            -- Step 1. Collect money
            for i, v in pairs(stands:GetChildren()) do
                local Event = tycoon.Remotes.WakeIncomeStream
                Event:InvokeServer(
                    v.Name
                )
            end
            task.wait()
        end
    end)

    while getgenv().farming do
        -- Step 2. Buy cool stuff
        pcall(function()
            if not getgenv().farmsettings.purchase then return end
            for _, fold in pairs(PurchasesFold:GetChildren()) do
                if fold:FindFirstChild("Buttons") then
                    for i, nFold in pairs(fold.Buttons:GetChildren()) do
                        if nFold:IsA("Folder") then
                            for _,btn in pairs(nFold:GetChildren()) do
                                if btn:GetAttribute("Shown") and btn:GetAttribute("Enabled") and not btn:GetAttribute("Purchased") then
                                    local price = decodeValue(btn.Button.Gui.Price.Text)
                                    local curbalance = decodeValue(plr.leaderstats.Cash.Value)

                                    if price <= curbalance then
                                        firetouchinterest(plr.Character.Head, btn.Button, true)
                                        task.wait()
                                        firetouchinterest(plr.Character.Head, btn.Button, false)
                                    end
                                end
                            end
                        elseif nFold:IsA("Model") then
                            if nFold:GetAttribute("Shown") and nFold:GetAttribute("Enabled") and not nFold:GetAttribute("Purchased") then
                                local price = decodeValue(nFold.Button.Gui.Price.Text)
                                local curbalance = decodeValue(plr.leaderstats.Cash.Value)

                                if price <= curbalance then
                                    firetouchinterest(plr.Character.Head, nFold.Button, true)
                                    task.wait()
                                    firetouchinterest(plr.Character.Head, nFold.Button, false)
                                end
                            end
                        end
                    end
                end
            end
        end)

        -- Step 3. Upgrade everything
        pcall(function()
            if not getgenv().farmsettings.upgrade then return end
            for _, fold in pairs(PurchasesFold:GetChildren()) do
                if fold:FindFirstChild(fold.Name) then
                    if not fold:FindFirstChild(fold.Name):GetAttribute("Enabled") then
                        continue
                    end
                    fold:FindFirstChild(fold.Name):FindFirstChild(fold.Name).Upgrade:InvokeServer(1)
                end
            end
        end)

        -- Step 4. Cash drops
        pcall(function()
            if not getgenv().farmsettings.cashdrop then return end
            for i, v in pairs(workspace.CashDrops:GetChildren()) do
                firetouchinterest(plr.Character.Head, v, true)
                task.wait()
                firetouchinterest(plr.Character.Head, v, false)
            end
        end)

        -- Step 5. Collect fruit
        pcall(function()
            if not getgenv().farmsettings.fruit then return end
            for i, v in pairs(tycoon.Constant.Trees:GetChildren()) do
                for _, lemon in pairs(v:GetChildren()) do
                    if not lemon.Name == "Fruit" then continue end
                    if not lemon:FindFirstChild("ClickPart") then continue end
                    fireclickdetector(lemon.ClickPart.ClickDetector)
                    task.wait()
                end
            end
        end)

        task.wait(1)
    end
end)

section1:label("Settings:")

section1:toggle("Auto Purchase", true, function(v)
    getgenv().farmsettings.purchase = v
end)
section1:toggle("Auto Collect", true, function(v)
    getgenv().farmsettings.collect = v
end)
section1:toggle("Auto Upgrade", true, function(v)
    getgenv().farmsettings.upgrade = v
end)
section1:toggle("Auto Cash Drop", true, function(v)
    getgenv().farmsettings.cashdrop = v
end)
section1:toggle("Auto Pickup Fruit", true, function(v)
    getgenv().farmsettings.fruit = v
end)

getgenv().antiafk = true

plr.Idled:Connect(function()
    if not getgenv().antiafk then return end
    game:GetService("VirtualUser"):Button2Down(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
    game:GetService("VirtualUser"):Button2Up(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
end)

-- Settings
section2:toggle("Disable 3D Rendering", false, function(v)
    game:GetService("RunService"):Set3dRenderingEnabled(not v)
end)

section2:toggle("Anti AFK", true, function(v)
    getgenv().antiafk = v
end)
