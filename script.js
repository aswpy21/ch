let isUnlocked = false;
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

// Initializes the misty, frosted glass texture over the screen
function initFogWindow() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create a semi-transparent condensation look
    ctx.fillStyle = 'rgba(235, 243, 250, 0.90)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add micro-droplet textures so the glass looks realistically cold
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 400; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Readjust canvas layout seamlessly if the phone changes orientation
window.addEventListener('resize', () => {
    if (isUnlocked) initFogWindow();
});

// Touch and Move Tracking State Machine
let drawing = false;

function getCoordinates(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX, y: clientY };
}

function startCarving(e) {
    if (!isUnlocked) return;
    drawing = true;
    carve(e);
}

function stopCarving() {
    drawing = false;
    ctx.beginPath(); // Resets structural line breaks
}

function carve(e) {
    if (!drawing || !isUnlocked) return;
    const pos = getCoordinates(e);
    
    // 'destination-out' cleanly blends and clears out the pixels
    ctx.globalCompositeOperation = 'destination-out';
    
    // Set up a thick brush width that mimics a human finger swipe
    ctx.lineWidth = 48; 
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // The secret sauce: Adding shadowBlur creates a soft, watery edge 
    // instead of a hard, digital cutout line.
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,0,0,1)'; 
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Desktop Mouse Event Tracking
canvas.addEventListener('mousedown', startCarving);
canvas.addEventListener('mousemove', carve);
window.addEventListener('mouseup', stopCarving);

// Mobile Touch Screen Event Tracking
canvas.addEventListener('touchstart', startCarving);
canvas.addEventListener('touchmove', carve);
window.addEventListener('touchend', stopCarving);

// Handle Surprise Reveal Overlay Hook
document.getElementById("open-btn").addEventListener("click", () => {
    isUnlocked = true;
    
    const overlay = document.getElementById("surprise-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.visibility = "hidden", 800);
    
    document.getElementById("main-content").classList.remove("blurred");
    
    const music = document.getElementById("bg-music");
    music.play().catch(err => console.log("Audio waiting for user gesture:", err));
    
    initFogWindow();
});
