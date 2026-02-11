function GenerateBadgeIcon({ icon }) { 
    const emojiMap = {
        "beginner": "🌱",  
        "contributor": "🤝", 
        "expert": "🎓",
        "curious": "🧐", 
        "thinker": "🧠",
        "liked": "❤️",
        "top": "🏆",
        "streak": "🔥", 
    };
 
    const displayIcon = emojiMap[icon?.toLowerCase()] || "⭐";

    return (
        <span className="text-xl leading-none flex items-center justify-center">
            {displayIcon}
        </span>
    );
}

export default GenerateBadgeIcon;