import { Game } from './Game.js'
import playgroundData from '../../content/playground.json'

export class PlaygroundPanels
{
    constructor()
    {
        this.game = Game.getInstance()
        this.data = playgroundData

        this.moodIndex = 2
        this.thoughtIndex = 0
        this.songIndex = 0
        this.jokeIndex = 0
        this.quoteIndex = 0
        this.musicPlaying = false
        this.musicInterval = null
        this.jokeRevealed = false

        this.elements = {
            mood: document.querySelector('.js-playground-mood'),
            thoughts: document.querySelector('.js-playground-thoughts'),
            music: document.querySelector('.js-playground-music'),
            jokes: document.querySelector('.js-playground-jokes'),
            quotes: document.querySelector('.js-playground-quotes'),
        }

        this.bind()
        this.game.modals.events.on('close', () => { this.stopMusic() })
        this.renderMood()
        this.renderThought()
        this.renderSong()
        this.renderJoke(false)
        this.renderQuote()
    }

    el(root, selector)
    {
        return root?.querySelector(selector) ?? null
    }

    bind()
    {
        const moodPicker = this.elements.mood?.querySelector('.js-mood-picker')
        if(moodPicker)
        {
            moodPicker.addEventListener('click', (event) =>
            {
                const button = event.target.closest('[data-mood-index]')
                if(!button)
                    return

                this.moodIndex = parseInt(button.dataset.moodIndex, 10)
                this.renderMood()
            })
        }

        this.elements.thoughts?.querySelector('.js-thought-next')?.addEventListener('click', () =>
        {
            this.thoughtIndex = (this.thoughtIndex + 1) % this.data.thoughts.length
            this.renderThought()
        })

        this.elements.music?.querySelector('.js-music-prev')?.addEventListener('click', () =>
        {
            this.stopMusic()
            this.songIndex = (this.songIndex - 1 + this.data.songs.length) % this.data.songs.length
            this.renderSong()
        })

        this.elements.music?.querySelector('.js-music-next')?.addEventListener('click', () =>
        {
            this.stopMusic()
            this.songIndex = (this.songIndex + 1) % this.data.songs.length
            this.renderSong()
        })

        this.elements.music?.querySelector('.js-music-toggle')?.addEventListener('click', () =>
        {
            if(this.musicPlaying)
                this.stopMusic()
            else
                this.startMusic()
        })

        this.elements.jokes?.querySelector('.js-joke-reveal')?.addEventListener('click', () =>
        {
            this.jokeRevealed = true
            this.renderJoke(true)
        })

        this.elements.jokes?.querySelector('.js-joke-next')?.addEventListener('click', () =>
        {
            this.jokeIndex = (this.jokeIndex + 1) % this.data.jokes.length
            this.jokeRevealed = false
            this.renderJoke(false)
        })

        this.elements.quotes?.querySelector('.js-quote-next')?.addEventListener('click', () =>
        {
            this.quoteIndex = Math.floor(Math.random() * this.data.quotes.length)
            this.renderQuote()
        })

        this.elements.quotes?.querySelector('.js-quote-copy')?.addEventListener('click', async () =>
        {
            const quote = this.data.quotes[this.quoteIndex]
            const text = `"${quote.text}" - ${quote.author}`

            try
            {
                await navigator.clipboard.writeText(text)
                const status = this.elements.quotes?.querySelector('.js-quote-copy-status')
                if(status)
                {
                    status.textContent = 'copied!'
                    setTimeout(() => { status.textContent = 'copy' }, 2000)
                }
            }
            catch
            {
                // clipboard unavailable
            }
        })
    }

    open(name)
    {
        this.game.inputs.interactiveButtons.clearItems()
        this.game.modals.open(name)
    }

    renderMood()
    {
        const root = this.elements.mood
        if(!root)
            return

        const mood = this.data.moods[this.moodIndex]
        if(!mood)
            return

        const power = Math.min(mood.powerLevel, 100)

        const emoji = this.el(root, '.js-mood-emoji')
        const label = this.el(root, '.js-mood-label')
        const message = this.el(root, '.js-mood-message')
        const powerEl = this.el(root, '.js-mood-power')
        const bar = this.el(root, '.js-mood-bar')
        const picker = this.el(root, '.js-mood-picker')

        if(emoji) emoji.textContent = mood.emoji
        if(label) label.textContent = mood.label
        if(message) message.textContent = `"${mood.message}"`
        if(powerEl) powerEl.textContent = `${mood.powerLevel}%`
        if(bar) bar.style.width = `${power}%`

        if(picker)
        {
            picker.innerHTML = this.data.moods.map((item, index) =>
            {
                const active = index === this.moodIndex ? ' is-active' : ''
                return `<button type="button" class="playground-chip${active}" data-mood-index="${index}">${item.emoji} ${item.label}</button>`
            }).join('')
        }
    }

    renderThought()
    {
        const root = this.elements.thoughts
        const textEl = this.el(root, '.js-thought-text')
        if(!textEl)
            return

        textEl.textContent = this.data.thoughts[this.thoughtIndex] ?? ''
    }

    renderSong()
    {
        const root = this.elements.music
        if(!root)
            return

        const song = this.data.songs[this.songIndex]
        if(!song)
            return

        const title = this.el(root, '.js-music-title')
        const artist = this.el(root, '.js-music-artist')
        const vibe = this.el(root, '.js-music-vibe')
        const genre = this.el(root, '.js-music-genre')
        const bpm = this.el(root, '.js-music-bpm')
        const index = this.el(root, '.js-music-index')
        const toggle = this.el(root, '.js-music-toggle')

        if(title) title.textContent = song.title
        if(artist) artist.textContent = song.artist
        if(vibe) vibe.textContent = song.vibe
        if(genre) genre.textContent = song.genre
        if(bpm) bpm.textContent = `${song.bpm} BPM`
        if(index) index.textContent = `${this.songIndex + 1}/${this.data.songs.length}`
        if(toggle) toggle.textContent = this.musicPlaying ? 'Pause vibes' : 'Play vibes'
    }

    startMusic()
    {
        const root = this.elements.music
        if(!root)
            return

        this.stopMusic()

        this.musicPlaying = true
        this.renderSong()

        const song = this.data.songs[this.songIndex]
        if(!song?.bpm)
            return

        const beatInterval = 60000 / song.bpm

        this.musicInterval = setInterval(() =>
        {
            root.querySelectorAll('.js-music-bar').forEach((bar) =>
            {
                bar.style.height = `${20 + Math.random() * 80}%`
            })
        }, beatInterval)
    }

    stopMusic()
    {
        this.musicPlaying = false

        if(this.musicInterval)
        {
            clearInterval(this.musicInterval)
            this.musicInterval = null
        }

        const root = this.elements.music
        if(root)
        {
            root.querySelectorAll('.js-music-bar').forEach((bar, index) =>
            {
                const heights = [20, 40, 60, 80, 60, 40, 20]
                bar.style.height = `${heights[index] || 30}%`
            })
        }

        this.renderSong()
    }

    renderJoke(revealed)
    {
        const root = this.elements.jokes
        if(!root)
            return

        const joke = this.data.jokes[this.jokeIndex]
        if(!joke)
            return

        const emoji = this.el(root, '.js-joke-emoji')
        const setup = this.el(root, '.js-joke-setup')
        const punchline = this.el(root, '.js-joke-punchline')
        const revealButton = this.el(root, '.js-joke-reveal')
        const rating = this.el(root, '.js-joke-rating')

        if(emoji) emoji.textContent = joke.emoji
        if(setup) setup.textContent = joke.setup

        if(revealed || this.jokeRevealed)
        {
            if(punchline)
            {
                punchline.textContent = joke.punchline
                punchline.classList.add('is-visible')
            }
            if(revealButton) revealButton.style.display = 'none'
            if(rating) rating.textContent = `rating: ${joke.rating} / 5`
        }
        else
        {
            if(punchline)
            {
                punchline.textContent = ''
                punchline.classList.remove('is-visible')
            }
            if(revealButton) revealButton.style.display = 'inline-flex'
            if(rating) rating.textContent = ''
        }
    }

    renderQuote()
    {
        const root = this.elements.quotes
        if(!root)
            return

        const quote = this.data.quotes[this.quoteIndex]
        if(!quote)
            return

        const text = this.el(root, '.js-quote-text')
        const author = this.el(root, '.js-quote-author')
        const category = this.el(root, '.js-quote-category')

        if(text) text.textContent = quote.text
        if(author) author.textContent = quote.author
        if(category) category.textContent = quote.category
    }
}
