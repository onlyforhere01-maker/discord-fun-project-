import { Game } from './Game.js'

/**
 * De-emphasize upstream portfolio chrome: hide Bruno signage, trim socials, lock dusk mood.
 */
export class PlaygroundTheme
{
    constructor()
    {
        this.game = Game.getInstance()
        document.documentElement.classList.add('is-chaos-theme')
        this.applyWhenWorldReady()
    }

    applyWhenWorldReady()
    {
        let applied = false

        const apply = () =>
        {
            if(applied)
                return

            if(!this.game.world?.areas?.landing)
                return

            applied = true
            this.hideLandingLetters()
            this.tuneSocialArea()
        }

        apply()

        if(!applied)
        {
            const onTick = () =>
            {
                apply()
                if(applied)
                    this.game.ticker.events.off('tick', onTick)
            }
            this.game.ticker.events.on('tick', onTick)
        }
    }

    hideLandingLetters()
    {
        const landing = this.game.world?.areas?.landing
        if(!landing)
            return

        const letters = landing.references.items.get('letters')
        if(!letters)
            return

        for(const reference of letters)
        {
            reference.visible = false

            const object = reference.userData?.object
            if(object?.visual)
                object.visual.visible = false
        }
    }

    tuneSocialArea()
    {
        // Social pedestals removed via empty social.js — hide leftover meshes if area exists
        const social = this.game.world?.areas?.social
        if(!social)
            return

        const fans = social.references?.items?.get('fan')
        if(fans)
        {
            for(const fan of fans)
                fan.visible = false
        }
    }
}
