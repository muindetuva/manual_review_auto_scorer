// content.js
console.log('Content script loaded');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received:', request);
  if (request.action === "setScore") {
    try {
      setAllSlidersToPercentage(parseFloat(request.percentage));
      sendResponse({status: 'success', message: 'Sliders updated'});
    } catch (error) {
      console.error('Error in setAllSlidersToPercentage:', error);
      sendResponse({status: 'error', message: error.toString()});
    }
  }
  return true;  // Indicates that sendResponse will be called asynchronously
});

function setAllSlidersToPercentage(targetPercentage) {
  console.log('Setting sliders to', targetPercentage + '%');
  const sliders = document.querySelectorAll('input[data-type="slider"]');
  console.log('Found', sliders.length, 'sliders');
  
  // Calculate the total possible points
  const totalPossiblePoints = Array.from(sliders).reduce((sum, slider) => 
    sum + parseFloat(slider.getAttribute('data-points')), 0);
  
  // Calculate the target total score
  const targetTotalScore = totalPossiblePoints * (targetPercentage / 100);
  
  // Distribute the score across sliders
  let remainingScore = targetTotalScore;
  sliders.forEach((slider, index) => {
    const maxPoints = parseFloat(slider.getAttribute('data-points'));
    let points;
    
    if (index === sliders.length - 1) {
      points = Math.min(remainingScore, maxPoints);
    } else {
      points = Math.min(maxPoints, (maxPoints / totalPossiblePoints) * targetTotalScore);
    }
    
    points = Math.round(points * 10) / 10;
    
    slider.value = points;
    
    const scoreSpan = slider.parentElement.querySelector('.score_value');
    if (scoreSpan) {
      scoreSpan.textContent = points;
    }
    
    const sliderHandle = slider.parentElement.querySelector('.slider-handle');
    if (sliderHandle) {
      const percentage = (points / maxPoints) * 100;
      sliderHandle.style.left = `${percentage}%`;
    }
    
    remainingScore -= points;
  });
  
  updateTotals();
  console.log('Sliders updated');
}

function getCurrentScoreAndPercentage() {
  const sliders = document.querySelectorAll('input[data-type="slider"]');
  const totalPossiblePoints = Array.from(sliders).reduce((sum, slider) => 
    sum + parseFloat(slider.getAttribute('data-points')), 0);
  const currentScore = Array.from(sliders).reduce((sum, slider) => 
    sum + parseFloat(slider.value), 0);
  const percentage = (currentScore / totalPossiblePoints) * 100;
  
  return {
    score: Math.round(currentScore * 10) / 10,
    totalPossible: totalPossiblePoints,
    percentage: Math.round(percentage * 10) / 10
  };
}

function updateTotals() {
  console.log('Totals updated');
  console.log(getCurrentScoreAndPercentage());
}

// Immediately log the current score when the script loads
console.log('Initial score:', getCurrentScoreAndPercentage());
