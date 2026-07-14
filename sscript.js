let isUnlocked = false;
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');

function initFogWindow() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create a realistic, semi-transparent misty white steam layer
    ctx.fillStyle = 'rgba(235, 243, 250, 0.88)'; // Frosted condensation look
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add micro-texture so the fog looks slightly beaded with moisture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 500; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 4 + 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.addEventListener('resize', () => {
    if (isUnlocked) initFogWindow();
});

// Drawing States
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
    ctx.beginPath();
}

function carve(e) {
    if (!drawing || !isUnlocked) return;
    const pos = getCoordinates(e);
    
    // This is the magic formula that makes it feel like water/steam!
    ctx.globalCompositeOperation = 'destination-out';
    
    // Set up a soft, blurry brush edge
    ctx.lineWidth = 45; // Thickness of a thumb wiping condensation
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Adding shadowBlur on a transparent brush makes the edges look wet and melted
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,0,0,1)'; 
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Attach Event Listeners
canvas.addEventListener('mousedown', startCarving);
canvas.addEventListener('mousemove', carve);
window.addEventListener('mouseup', stopCarving);

canvas.addEventListener('touchstart', startCarving);
canvas.addEventListener('touchmove', carve);
window.addEventListener('touchend', stopCarving);

// Unlock Site Hook
document.getElementById("open-btn").addEventListener("click", () => {
    isUnlocked = true;
    
    const overlay = document.getElementById("surprise-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.visibility = "hidden", 800);
    
    document.getElementById("main-content").classList.remove("blurred");
    
    const music = document.getElementById("bg-music");
    music.play().catch(err => console.log("Audio waiting..."));
    
    initFogWindow();
});
