document.addEventListener('DOMContentLoaded', () => {
    const countDisplay = document.getElementById('count');
    const innerCircle = document.getElementById('inner-circle');
    const outerRing = document.getElementById('outer-ring');
    const resetButton = document.getElementById('reset');
    let count = 0;
    const totalPresses = 100; // Define how many presses complete one full circle

    innerCircle.addEventListener('click', () => {
        count++;
        countDisplay.textContent = count;
        const degree = (count % totalPresses) * (360 / totalPresses);
        outerRing.style.background = `conic-gradient(#d4e157 ${degree}deg, transparent 0)`;
    });

    resetButton.addEventListener('click', () => {
        count = 0;
        countDisplay.textContent = count;
        outerRing.style.background = 'none';
    });
});
