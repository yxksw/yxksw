import {
    Star, Sprout, Leaf, Flower,
    Feather, Wind, Cloud, Droplets,
    Snowflake, Mountain, Shield, Flame,
    Sun, Zap, Crown, Ghost
} from 'lucide-react';

export const DISCONNECTED_LEVEL = {
    days: 0,
    level: 0,
    title: '失联',
    Icon: Ghost,
    theme: 'text-gray-400',
    color: 'text-gray-400',
    border: 'border-gray-200 hover:border-gray-300'
};

// 15级友链等级配置 - 每一级都有独特的配色
export const FRIEND_LEVELS = [
    {
        days: 30, level: 1, title: '初遇', Icon: Star,
        theme: 'text-slate-600',
        border: 'border-slate-200 group-hover:border-slate-400',
        color: 'text-slate-600'
    },
    {
        days: 60, level: 2, title: '萌芽', Icon: Sprout,
        theme: 'text-lime-600',
        border: 'border-lime-200 group-hover:border-lime-400',
        color: 'text-lime-600'
    },
    {
        days: 90, level: 3, title: '抽叶', Icon: Leaf,
        theme: 'text-green-600',
        border: 'border-green-200 group-hover:border-green-400',
        color: 'text-green-600'
    },
    {
        days: 180, level: 4, title: '绽放', Icon: Flower,
        theme: 'text-emerald-600',
        border: 'border-emerald-200 group-hover:border-emerald-400',
        color: 'text-emerald-600'
    },
    {
        days: 270, level: 5, title: '轻语', Icon: Feather,
        theme: 'text-teal-600',
        border: 'border-teal-200 group-hover:border-teal-400',
        color: 'text-teal-600'
    },
    {
        days: 365, level: 6, title: '听风', Icon: Wind,
        theme: 'text-cyan-600',
        border: 'border-cyan-200 group-hover:border-cyan-400',
        color: 'text-cyan-600'
    },
    {
        days: 450, level: 7, title: '云游', Icon: Cloud,
        theme: 'text-sky-600',
        border: 'border-sky-200 group-hover:border-sky-400',
        color: 'text-sky-600'
    },
    {
        days: 540, level: 8, title: '润泽', Icon: Droplets,
        theme: 'text-blue-600',
        border: 'border-blue-200 group-hover:border-blue-400',
        color: 'text-blue-600'
    },
    {
        days: 630, level: 9, title: '凝冰', Icon: Snowflake,
        theme: 'text-indigo-600',
        border: 'border-indigo-200 group-hover:border-indigo-400',
        color: 'text-indigo-600'
    },
    {
        days: 730, level: 10, title: '磐石', Icon: Mountain,
        theme: 'text-stone-600',
        border: 'border-stone-200 group-hover:border-stone-400',
        color: 'text-stone-600'
    },
    {
        days: 900, level: 11, title: '坚守', Icon: Shield,
        theme: 'text-amber-600',
        border: 'border-amber-200 group-hover:border-amber-400',
        color: 'text-amber-600'
    },
    {
        days: 1080, level: 12, title: '燃情', Icon: Flame,
        theme: 'text-orange-600',
        border: 'border-orange-200 group-hover:border-orange-400',
        color: 'text-orange-600'
    },
    {
        days: 1460, level: 13, title: '烈阳', Icon: Sun,
        theme: 'text-red-600',
        border: 'border-red-200 group-hover:border-red-400',
        color: 'text-red-600'
    },
    {
        days: 1825, level: 14, title: '雷鸣', Icon: Zap,
        theme: 'text-purple-600',
        border: 'border-purple-200 group-hover:border-purple-400',
        color: 'text-purple-600'
    },
    {
        days: 2190, level: 15, title: '传世', Icon: Crown,
        theme: 'text-fuchsia-600',
        border: 'border-fuchsia-200 group-hover:border-fuchsia-400',
        color: 'text-fuchsia-600'
    },
];
