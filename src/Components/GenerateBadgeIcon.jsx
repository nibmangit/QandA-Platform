import {Brain, Crown, Search, Sparkle, Sparkles, Star, ThumbsUp, Trophy, Zap } from "lucide-react";

function GenerateBadgeIcon({icon}){
    switch(icon){
        case "zap": return ( <Zap size={16} />  )
        case "crown": return ( <Crown size={16} />)
        case "thumbs-up": return ( <ThumbsUp size={16} />)
        case "brain": return ( <Brain size={16} /> )
        case "search": return ( <Search size={16} />)
        case "trophy": return ( <Trophy size={16} /> )
        case "star": return ( <Star size={16} />)
        case "sparkles": return ( <Sparkles size={16} />)
        default:
            return;
    }
}

export default GenerateBadgeIcon;