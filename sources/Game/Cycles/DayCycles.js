import * as THREE from 'three/webgpu'
import { Cycles } from './Cycles.js'

// Cyberpunk dusk palette — kept bright enough to see the world (avoid pitch-black fog)
const presets = {
    day:   { revealColor: new THREE.Color('#00e5ff'), revealIntensity: 9, electricField: 0.15, temperature: 2, lightColor: new THREE.Color('#ffd2c2'), lightIntensity: 1.25, shadowColor: new THREE.Color('#4a0080'), fogColorA: new THREE.Color('#3e53ff'), fogColorB: new THREE.Color('#ff86d9'), fogNearRatio: 0.15, fogFarRatio: 1.25 },
    dusk:  { revealColor: new THREE.Color('#ff86d9'), revealIntensity: 6, electricField: 0.25, temperature: 0, lightColor: new THREE.Color('#ff8181'), lightIntensity: 1.2, shadowColor: new THREE.Color('#4e009c'), fogColorA: new THREE.Color('#3e53ff'), fogColorB: new THREE.Color('#ff4ce4'), fogNearRatio: 0, fogFarRatio: 1.25 },
    night: { revealColor: new THREE.Color('#b678ff'), revealIntensity: 10, electricField: 0.6, temperature: -5, lightColor: new THREE.Color('#6b8cff'), lightIntensity: 2.2, shadowColor: new THREE.Color('#2f00db'), fogColorA: new THREE.Color('#10266f'), fogColorB: new THREE.Color('#490a42'), fogNearRatio: -0.5, fogFarRatio: 1.1 },
    dawn:  { revealColor: new THREE.Color('#ff9d9d'), revealIntensity: 5, electricField: 0.2, temperature: 0, lightColor: new THREE.Color('#ffa882'), lightIntensity: 1.2, shadowColor: new THREE.Color('#db004f'), fogColorA: new THREE.Color('#f885ff'), fogColorB: new THREE.Color('#ff7d24'), fogNearRatio: 0.25, fogFarRatio: 1.2 },
}

export class DayCycles extends Cycles
{
    constructor()
    {
        const forcedProgress = import.meta.env.VITE_DAY_CYCLE_PROGRESS
            ? parseFloat(import.meta.env.VITE_DAY_CYCLE_PROGRESS)
            : 0.27
        super('🕜 Day Cycles', 4 * 60, forcedProgress, false)
    }

    get presets()
    {
        return presets
    }

    getKeyframesDescriptions()
    {
        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel.addBinding(this, 'duration', { min: 1, max: 60 * 10, step: 1 })

            for(const presetKey in presets)
            {
                const preset = presets[presetKey]
                const presetsDebugPanel = this.debugPanel.addFolder({
                    title: presetKey,
                    expanded: true,
                })

                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.revealColor, 'revealColor')
                presetsDebugPanel.addBinding(preset, 'revealIntensity', { min: 0, max: 20, step: 0.001 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.lightColor, 'lightColor')
                presetsDebugPanel.addBinding(preset, 'lightIntensity', { min: 0, max: 20 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.shadowColor, 'shadowColor')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorA, 'fogColorA')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorB, 'fogColorB')
                presetsDebugPanel.addBinding(preset, 'fogNearRatio', { label: 'near', min: -2, max: 2, step: 0.001 })
                presetsDebugPanel.addBinding(preset, 'fogFarRatio', { label: 'far', min: -2, max: 2, step: 0.001 })
            }
        }

        return [
            [
                { properties: presets.day, stop: 0.0 }, // day
                { properties: presets.day, stop: 0.15 }, // day
                { properties: presets.dusk, stop: 0.25 }, // Dusk
                { properties: presets.night, stop: 0.35 }, // Night
                { properties: presets.night, stop: 0.6 }, // Night
                { properties: presets.dawn, stop: 0.8 }, // Dawn
                { properties: presets.day, stop: 0.9 }, // day
            ]
        ]
    }

    getIntervalDescriptions()
    {
        return [
            { name: 'night', start: 0.25, end: 0.7 },
            { name: 'deepNight', start: 0.35, end: 0.6 },
        ]
    }
}