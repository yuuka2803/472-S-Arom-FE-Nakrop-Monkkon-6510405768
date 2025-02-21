import { Button } from "@/components/ui/button";
import { CoolMode } from "@/components/ui/cool-mode";

export function CoolModeCustom() {
  return (
    <div className="relative justify-center">
      <CoolMode
        options={{        
            particle: "https://i.postimg.cc/Gt0NqnXJ/InLove.png",
            size: 100,
            speedUp: 4,
        }}
      >
        <button> 
            <img src="https://i.postimg.cc/Gt0NqnXJ/InLove.png"
        
        /></button>
      </CoolMode>
    </div>
  );
}
