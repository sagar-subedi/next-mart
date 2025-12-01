'use client'
import { MoveRight, ShoppingBag, Star, Sparkles, TrendingUp, Users, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useUser from "../../../../hooks/useUser"

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStats, setCurrentStats] = useState({ sellers: 0, customers: 0 })
    const router = useRouter()
    const { user } = useUser()

    useEffect(() => {
        setIsVisible(true)
        // 数字动画效果
        const animateNumbers = () => {
            const duration = 2000
            const startTime = Date.now()

            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)

                setCurrentStats({
                    sellers: Math.floor(1000 * progress),
                    customers: Math.floor(50000 * progress)
                })

                if (progress < 1) {
                    requestAnimationFrame(animate)
                }
            }

            requestAnimationFrame(animate)
        }

        const timer = setTimeout(animateNumbers, 500)
        return () => clearTimeout(timer)
    }, [])

    const handleShopNow = () => {
        // 检查用户是否已登录
        if (user) {
            router.push('/products')
        } else {
            router.push('/login')
        }
    }

    const handleBecomeSeller = () => {
        // 检查用户是否已登录
        if (user) {
            router.push('/become-a-seller')
        } else {
            router.push('/login')
        }
    }

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black">
            {/* 动态背景渐变 */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/50 to-indigo-900/40"></div>

            {/* 动态网格背景 */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* 浮动光效 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-slate-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-indigo-400/20 to-slate-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 xl:px-16 relative z-10 py-10">
                <div className="flex justify-center">
                    <div className="grid lg:grid-cols-12 gap-20 xl:gap-24 items-center max-w-6xl">
                        {/* 左侧内容 */}
                        <div className={`lg:col-span-6 space-y-8 lg:space-y-10 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                            {/* 主标题 - 更大胆的设计 */}
                            <div className="space-y-6">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                                    <span className="text-white block">Discover</span>
                                    <span className="block">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-blue-400 to-indigo-400 animate-pulse">
                                            Quality
                                        </span>
                                    </span>
                                    <span className="text-white block">Everything</span>
                                </h1>
                                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl leading-relaxed">
                                    The ultimate marketplace connecting
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 font-semibold"> premium sellers </span>
                                    with discerning buyers worldwide
                                </p>
                            </div>

                            {/* 动态统计数据 */}
                            <div className="grid grid-cols-3 gap-6 lg:gap-8 text-white">
                                <div className="text-center space-y-2">
                                    <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                        {currentStats.sellers.toLocaleString()}+
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-400 flex items-center justify-center gap-1">
                                        <Users className="w-4 h-4" />
                                        Active Sellers
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                        {(currentStats.customers / 1000).toFixed(0)}K+
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-400 flex items-center justify-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Happy Customers
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
                                        24/7
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-400 flex items-center justify-center gap-1">
                                        <Zap className="w-4 h-4" />
                                        Support
                                    </div>
                                </div>
                            </div>

                            {/* 现代按钮设计 */}
                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
                                <button
                                    onClick={handleShopNow}
                                    className="group relative bg-gradient-to-r from-slate-500 to-blue-500 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-2xl font-bold text-base lg:text-lg shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center justify-center gap-3 group-hover:-translate-y-1 transform transition-transform duration-300">
                                        <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
                                        Shop Now
                                        <MoveRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-500 to-blue-500 blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                                </button>

                                <button
                                    onClick={handleBecomeSeller}
                                    className="group relative border-2 border-white/30 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-2xl font-bold text-base lg:text-lg backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center gap-3 group-hover:-translate-y-1 transform transition-transform duration-300">
                                        <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
                                        Become a Seller
                                        <MoveRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* 右侧图片和卡片 */}
                        <div className={`lg:col-span-6 relative flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            <div className="relative group">
                                {/* 主图片 */}
                                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                                    <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-slate-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                        <div className="text-center text-white space-y-4">
                                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-slate-400 to-blue-400 rounded-full mx-auto flex items-center justify-center shadow-2xl">
                                                <ShoppingBag className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                                            </div>
                                            <h3 className="text-xl lg:text-2xl font-bold">Premium Products</h3>
                                            <p className="text-gray-300 text-sm lg:text-base">Curated with excellence</p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                {/* 浮动快递卡片 */}
                                <div className="absolute -bottom-6 -left-6 lg:-bottom-8 lg:-left-8 bg-white/95 backdrop-blur-xl rounded-2xl p-4 lg:p-5 shadow-2xl border border-white/20 max-w-[220px] lg:max-w-[250px] animate-pulse">
                                    <div className="flex items-center gap-3 lg:gap-4">
                                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                            <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-800 text-base lg:text-lg">Lightning Fast</div>
                                            <div className="text-gray-600 text-sm lg:text-base">Same-day delivery</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 评分卡片 */}
                                <div className="absolute -top-6 -right-6 lg:-top-8 lg:-right-8 bg-white/95 backdrop-blur-xl rounded-2xl p-4 lg:p-5 shadow-2xl border border-white/20 animate-pulse" style={{ animationDelay: '1s' }}>
                                    <div className="text-center space-y-2">
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <div className="font-bold text-gray-800 text-xl lg:text-2xl">4.9</div>
                                        <div className="text-gray-600 font-medium text-sm lg:text-base">Excellent Rating</div>
                                    </div>
                                </div>

                                {/* 新增的热门标签 */}
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg animate-bounce">
                                    🔥 HOT
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero