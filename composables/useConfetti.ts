// composables/useConfetti.ts
import { onScopeDispose } from 'vue'

export const useConfetti = () => {
    let confetti: any = null
    let celebrationInterval: ReturnType<typeof setInterval> | null = null
    let snowfallAnimation: number | null = null
    let sideCannonsAnimation: number | null = null

    const loadConfetti = async () => {
        if (!import.meta.client) return null

        if (!confetti) {
            const module = await import('canvas-confetti')
            confetti = module.default
        }

        return confetti
    }

    const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
    }

    // === Базовый взрыв из центра ===
    const burstFromCenter = async (options: Record<string, any> = {}) => {
        const fire = await loadConfetti()
        if (!fire) return

        fire({
            particleCount: 160,
            spread: 360,
            startVelocity: 35,
            gravity: 1,
            decay: 0.94,
            ticks: 200,
            origin: {
                x: 0.5,
                y: 0.5,
            },
            colors: [
                '#ff5252',
                '#ffd740',
                '#69f0ae',
                '#40c4ff',
                '#e040fb',
                '#ff6e40',
                '#7c4dff',
            ],
            disableForReducedMotion: true,
            ...options,
        })
    }

    // === Фейерверк из центра ===
    const fireworksFromCenter = async () => {
        const fire = await loadConfetti()
        if (!fire) return

        const defaults = {
            origin: { x: 0.5, y: 0.5 },
            spread: 360,
            startVelocity: 40,
            gravity: 1,
            ticks: 220,
            disableForReducedMotion: true,
        }

        fire({
            ...defaults,
            particleCount: 80,
        })

        setTimeout(() => {
            fire({
                ...defaults,
                particleCount: 60,
                startVelocity: 30,
                scalar: 0.9,
            })
        }, 120)

        setTimeout(() => {
            fire({
                ...defaults,
                particleCount: 50,
                startVelocity: 50,
                scalar: 0.7,
            })
        }, 240)
    }

    // === Непрерывное конфети (дождь с боков) ===
    const celebration = async (
        duration: number = 15 * 1000,
        options: Record<string, any> = {}
    ) => {
        const fire = await loadConfetti()
        if (!fire) return

        stopCelebration()

        const animationEnd = Date.now() + duration

        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0,
            disableForReducedMotion: true,
            ...options,
        }

        celebrationInterval = setInterval(() => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return stopCelebration()
            }

            const particleCount = 50 * (timeLeft / duration)

            fire({
                ...defaults,
                particleCount,
                origin: {
                    x: randomInRange(0.1, 0.3),
                    y: Math.random() - 0.2,
                },
            })

            fire({
                ...defaults,
                particleCount,
                origin: {
                    x: randomInRange(0.7, 0.9),
                    y: Math.random() - 0.2,
                },
            })
        }, 250)
    }

    const stopCelebration = () => {
        if (celebrationInterval) {
            clearInterval(celebrationInterval)
            celebrationInterval = null
        }
    }

    // === Снегопад (белые круги) ===
    const snowfall = async (
        duration: number = 15 * 1000,
        options: Record<string, any> = {}
    ) => {
        const fire = await loadConfetti()
        if (!fire) return

        stopSnowfall()

        const animationEnd = Date.now() + duration
        let skew = 1

        const defaults = {
            colors: ['#ffffff'],
            shapes: ['circle'],
            ...options,
        }

        const frame = () => {
            const timeLeft = animationEnd - Date.now()
            const ticks = Math.max(200, 500 * (timeLeft / duration))
            skew = Math.max(0.8, skew - 0.001)

            fire({
                ...defaults,
                particleCount: 1,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * skew) - 0.2,
                },
                gravity: randomInRange(0.4, 0.6),
                scalar: randomInRange(0.4, 1),
                drift: randomInRange(-0.4, 0.4),
            })

            if (timeLeft > 0) {
                snowfallAnimation = requestAnimationFrame(frame)
            } else {
                stopSnowfall()
            }
        }

        snowfallAnimation = requestAnimationFrame(frame)
    }

    const stopSnowfall = () => {
        if (snowfallAnimation) {
            cancelAnimationFrame(snowfallAnimation)
            snowfallAnimation = null
        }
    }

    // === Пулемёт из боков (красный и белый) ===
    const sideCannons = async (
        duration: number = 15 * 1000,
        colors: string[] = ['#bb0000', '#ffffff']
    ) => {
        const fire = await loadConfetti()
        if (!fire) return

        stopSideCannons()

        const end = Date.now() + duration

        const frame = () => {
            fire({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            })

            fire({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            })

            if (Date.now() < end) {
                sideCannonsAnimation = requestAnimationFrame(frame)
            } else {
                stopSideCannons()
            }
        }

        sideCannonsAnimation = requestAnimationFrame(frame)
    }

    const stopSideCannons = () => {
        if (sideCannonsAnimation) {
            cancelAnimationFrame(sideCannonsAnimation)
            sideCannonsAnimation = null
        }
    }

    // Автоматическая очистка всех анимаций при размонтировании
    onScopeDispose(() => {
        stopCelebration()
        stopSnowfall()
        stopSideCannons()
    })

    return {
        burstFromCenter,
        fireworksFromCenter,
        celebration,
        stopCelebration,
        snowfall,
        stopSnowfall,
        sideCannons,
        stopSideCannons,
    }
}
