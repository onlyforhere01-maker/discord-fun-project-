import * as THREE from 'three/webgpu'

const text = `
███╗   ███╗██╗   ██╗    ██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗     
████╗ ████║╚██╗ ██╔╝    ██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║     
██╔████╔██║ ╚████╔╝     ██║  ██║██║██║  ███╗██║   ██║   ███████║██║     
██║╚██╔╝██║  ╚██╔╝      ██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║     
██║ ╚═╝ ██║   ██║       ██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗
╚═╝     ╚═╝   ╚═╝       ╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
                                                                         
██████╗ ██╗      █████╗ ██╗   ██╗ ██████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗ 
██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗
██████╔╝██║     ███████║ ╚████╔╝ ██║     ██║   ██║██║   ██║██╔██╗ ██║██║  ██║
██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██║     ██║   ██║██║   ██║██║╚██╗██║██║  ██║
██║     ███████╗██║  ██║   ██║   ╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝
╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ 

╔═ welcome ═════════════╗
║ welcome to my chaos
║ drive · ENTER at markers · collect vibes
║ mood · thoughts · music · jokes · quotes
╚═══════════════════════╝

╔═ zones ══════════════╗
║ blacksmith    ⇒ vibe shrine
║ thought portal ⇒ thought bench
║ time machine  ⇒ radio
║ cookie hut    ⇒ comedy board
║ lab           ⇒ fortune kiosk
╚═══════════════════════╝

╔═ stack ══════════════╗
║ Three.js r${THREE.REVISION} · Rapier · Howler
║ 3D world inspired by folio-2025 (MIT) — re-skinned for this playground
║ content/playground.json · legacy/ for the old 2D UI
╚═══════════════════════╝

╔═ debug ══════════════╗
║ #debug in URL + reload for tweak pane
║ [V] free camera
╚═══════════════════════╝
`
let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #00e5ff; font: 400 1em monospace;',
    pipe: 'color: #ff6bb5; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'

        finalStyles.push(stylesSet[currentStyle])
    }
    finalText += char
}

export default [finalText, ...finalStyles]
