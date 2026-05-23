import { Game } from './Game.js'
/**
 * Replace portfolio 3D boards with playground labels; hide carousels and URLs.
 */
export class PlaygroundSignage
{
    constructor()
    {
        this.game = Game.getInstance()
    }

    apply()
    {
        this.stripProjectsArea()
        this.stripLabArea()
    }

    hideObject(object)
    {
        if(!object)
            return

        object.visible = false

        if(object.isObject3D)
        {
            object.traverse((child) =>
            {
                child.visible = false
            })
        }
    }

    hideReference(area, name)
    {
        const refs = area.references.items.get(name)
        if(!refs)
            return

        const list = Array.isArray(refs) ? refs : [refs]

        for(const ref of list)
            this.hideObject(ref)
    }

    setAreaTitle(area, lines)
    {
        if(!area?.title?.textCanvas)
            return

        area.title.inner.rotation.set(0, 0, 0)
        area.title.textCanvas.updateText(lines)
        area.title.status = 'visible'

        if(area.title.group)
            area.title.group.visible = true
    }

    stripProjectsArea()
    {
        const area = this.game.world?.areas?.projects
        if(!area)
            return

        if(area.blackBoard)
            area.blackBoard.active = false

        if(area.images?.mesh)
            area.images.mesh.visible = false

        const hideNames = [
            'pagination',
            'previous',
            'next',
            'url',
            'attributes',
            'distinctions',
            'arrowPreviousProject',
            'arrowNextProject',
            'arrowPreviousImage',
            'arrowNextImage',
            'blackboardLabelsGamepadPlaystation',
            'blackboardLabelsGamepadXbox',
            'blackboardLabelsMouseKeyboard',
        ]

        for(const name of hideNames)
            this.hideReference(area, name)

        this.setAreaTitle(area, [ 'VIBE', 'SHRINE' ])

        if(area.url?.group)
            this.hideObject(area.url.group)

        if(area.images?.mesh)
            area.images.mesh.visible = false
    }

    stripLabArea()
    {
        const area = this.game.world?.areas?.lab
        if(!area)
            return

        if(area.blackBoard)
            area.blackBoard.active = false

        if(area.images?.mesh)
            area.images.mesh.visible = false

        const hideNames = [
            'url',
            'arrowPrevious',
            'arrowNext',
            'chainLeft',
            'chainRight',
            'chainPulley',
            'gearA',
            'gearB',
            'gearC',
            'mini',
            'blackboardLabelsGamepadPlaystation',
            'blackboardLabelsGamepadXbox',
            'blackboardLabelsMouseKeyboard',
        ]

        for(const name of hideNames)
            this.hideReference(area, name)

        if(area.scroller?.minis?.items)
        {
            for(const mini of area.scroller.minis.items)
                this.hideObject(mini.group)
        }

        this.setAreaTitle(area, [ 'FORTUNE', 'KIOSK' ])

        if(area.images?.mesh)
            area.images.mesh.visible = false
    }

    static applySafe(game)
    {
        try
        {
            new PlaygroundSignage().apply()
        }
        catch(error)
        {
            console.warn('PlaygroundSignage.apply failed (non-fatal):', error)
        }
    }
}
