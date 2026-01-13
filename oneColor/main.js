// 99% vibe coded, see vibes.txt

const colorInput = document.getElementById('colorInput');
const colorPicker = document.getElementById('colorPicker');
const colorPickerInput = document.getElementById('colorPickerInput');
const colorPickerSvg = document.getElementById('colorPickerSvg');
const controls = document.getElementById('controls');
const showBtn = document.getElementById('showBtn');
const hideBtn = document.getElementById('hideBtn');
const saveBtn = document.getElementById('saveBtn');
const editBtn = document.getElementById('editBtn');
const resetBtn = document.getElementById('resetBtn');
const savedColorsContainer = document.getElementById('savedColors');

let isEditMode = false;
let svgDoc = null;
let svgCircle = null;

// Default colors array
const defaultColors = [
  { color: '#e74c3c', name: 'Red' },
  { color: '#3498db', name: 'Blue' },
  { color: '#2ecc71', name: 'Green' },
  { color: '#f39c12', name: 'Orange' },
  { color: '#9b59b6', name: 'Purple' },
  { color: '#1abc9c', name: 'Teal' },
  { color: '#e91e63', name: 'Pink' },
  { color: '#34495e', name: 'Dark Gray' },
  { color: '#f1c40f', name: 'Yellow' }
];

// Load saved colors from localStorage
function loadSavedColors() {
  const saved = localStorage.getItem('savedColors');
  if (!saved) {
    // Initialize with default colors if nothing saved
    localStorage.setItem('savedColors', JSON.stringify(defaultColors));
    return defaultColors;
  }
  return JSON.parse(saved);
}

// Reset to default colors
function resetColors() {
  if (confirm('Reset to default colors? This will remove all your saved colors.')) {
    localStorage.setItem('savedColors', JSON.stringify(defaultColors));
    displaySavedColors();
  }
}

// Save color to localStorage
function saveColor() {
  const color = colorInput.value;
  if (!color || !color.match(/^#[0-9A-F]{6}$/i)) {
    return;
  }
  
  let saved = loadSavedColors();
  
  // Don't add duplicates (check by color)
  const exists = saved.find(item => item.color === color);
  if (!exists) {
    saved.push({ color, name: color });
    localStorage.setItem('savedColors', JSON.stringify(saved));
    displaySavedColors();
  }
}

// Display saved colors
function displaySavedColors() {
  savedColorsContainer.innerHTML = '';
  const saved = loadSavedColors();
  
  if (saved.length === 0) {
    savedColorsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">No saved colors yet</p>';
    return;
  }
  
  saved.forEach((item, index) => {
    // Handle both old format (string) and new format (object)
    const color = typeof item === 'string' ? item : item.color;
    const name = typeof item === 'string' ? item : item.name;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'color-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '5px';
    
    const button = document.createElement('button');
    button.className = 'color-btn';
    button.style.background = color;
    button.textContent = name;
    
    if (!isEditMode) {
      button.onclick = () => setColor(color);
    } else {
      button.classList.add('edit-mode');
      // In edit mode, make it editable
      button.onclick = () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = name;
        input.style.width = '100%';
        input.style.padding = '12px';
        input.style.fontSize = '14px';
        input.style.border = '2px solid #4CAF50';
        input.style.borderRadius = '8px';
        input.style.textAlign = 'center';
        
        input.onblur = () => {
          const newName = input.value.trim() || color;
          let saved = loadSavedColors();
          saved[index].name = newName;
          localStorage.setItem('savedColors', JSON.stringify(saved));
          displaySavedColors();
        };
        
        input.onkeypress = (e) => {
          if (e.key === 'Enter') {
            input.blur();
          }
        };
        
        button.replaceWith(input);
        input.focus();
        input.select();
      };
      
      // Add delete button in edit mode
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.style.cssText = 'position: absolute; top: -5px; right: -5px; width: 24px; height: 24px; border-radius: 50%; background: #f44336; color: white; border: none; cursor: pointer; font-size: 18px; line-height: 1; padding: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transition: transform 0.1s; z-index: 10;';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        let saved = loadSavedColors();
        saved.splice(index, 1);
        localStorage.setItem('savedColors', JSON.stringify(saved));
        displaySavedColors();
      };
      wrapper.appendChild(deleteBtn);
    }
    
    wrapper.appendChild(button);
    savedColorsContainer.appendChild(wrapper);
  });
}

// Toggle edit mode
function toggleEditMode() {
  isEditMode = !isEditMode;
  editBtn.textContent = isEditMode ? 'Done' : 'Edit';
  editBtn.style.background = isEditMode ? '#4CAF50' : '#2196F3';
  displaySavedColors();
}

// Sync text input with color picker
colorInput.addEventListener('input', function () {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.style.color = this.value;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    if (computedColor !== 'rgba(0, 0, 0, 0)' && this.value.match(/^#[0-9A-F]{6}$/i)) {
      colorPickerInput.value = this.value;
      updateSvgCircleColor(this.value);
    }
  } catch (e) { }
  
  // Apply color on every input change
  document.body.style.backgroundColor = this.value;
});

// Sync color picker with text input
colorPickerInput.addEventListener('input', function () {
  colorInput.value = this.value;
  updateSvgCircleColor(this.value);
  document.body.style.backgroundColor = this.value;
});

function setColor(color) {
  colorInput.value = color;
  colorPickerInput.value = color;
  updateSvgCircleColor(color);
  document.body.style.backgroundColor = color;
}

function updateSvgCircleColor(color) {
  // Update the circle color if SVG is loaded
  if (svgCircle) {
    svgCircle.setAttribute('fill', color);
  }
}

// Click SVG to open color picker
colorPickerSvg.addEventListener('click', function() {
  colorPickerInput.click();
});

// Load SVG once and inline it
function loadSvg() {
  fetch('colorPicker.svg')
    .then(response => response.text())
    .then(svgText => {
      const parser = new DOMParser();
      svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;
      
      // Get reference to the circle
      svgCircle = svgElement.querySelector('circle');
      
      // Copy attributes from img to svg
      svgElement.id = 'colorPickerSvg';
      svgElement.style.cursor = 'pointer';
      
      // Add click handler
      svgElement.addEventListener('click', function() {
        colorPickerInput.click();
      });
      
      // Replace img with inline SVG
      colorPickerSvg.replaceWith(svgElement);
      
      // Set initial color
      updateSvgCircleColor('#3498db');
    });
}

function enterFullscreen() {
  controls.classList.add('hidden');
  showBtn.classList.remove('visible');
  
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

function showControls() {
  controls.classList.remove('hidden');
  showBtn.classList.remove('visible');
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) {
    showControls();
  }
});

document.addEventListener('webkitfullscreenchange', function() {
  if (!document.webkitFullscreenElement) {
    showControls();
  }
});

document.addEventListener('msfullscreenchange', function() {
  if (!document.msFullscreenElement) {
    showControls();
  }
});

// Event listeners for buttons
hideBtn.addEventListener('click', enterFullscreen);
showBtn.addEventListener('click', showControls);
saveBtn.addEventListener('click', saveColor);
editBtn.addEventListener('click', toggleEditMode);
resetBtn.addEventListener('click', resetColors);

// Initialize
loadSvg();
displaySavedColors();
setColor('#3498db');
