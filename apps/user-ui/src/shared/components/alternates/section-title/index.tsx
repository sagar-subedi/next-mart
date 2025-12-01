'use client'
import { Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

interface SectionTitleProps {
    title: string
    subtitle?: string
    badge?: string
    centered?: boolean
    className?: string
}

const SectionTitle = ({ 
    title, 
    subtitle, 
    badge, 
    centered = true, 
    className = "" 
}: SectionTitleProps) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <div className={`space-y-6 ${centered ? 'text-center' : 'text-left'} ${className}`}>
            {/* 徽章 */}
            {badge && (
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    {badge}
                </div>
            )}
            
            {/* 主标题 */}
            <div className={`space-y-4 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700 delay-200`}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
                        {title}
                    </span>
                </h2>
                
                {/* 副标题 */}
                {subtitle && (
                    <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
            
            {/* 装饰性分隔线 */}
            <div className={`flex items-center justify-center gap-4 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'} transition-all duration-700 delay-400`}>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-teal-400"></div>
            </div>
        </div>
    )
}

export default SectionTitle 