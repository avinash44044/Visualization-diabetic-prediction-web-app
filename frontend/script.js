let myChart, myPieChart; // Global chart variables

document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = getInputData();

    if (!validateInput(data)) return;

    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const result = await response.json();
        document.getElementById('result').textContent = `Prediction: ${result.prediction}`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Error occurred. Please try again.';
    }
});

document.getElementById('viewCharts').addEventListener('click', () => {
    const data = getInputData();

    if (!validateInput(data)) return;

    generateCharts(data);
    generateInsights(data);

    document.getElementById('chartContainer').style.display = 'block';
});

function getInputData() {
    return {
        pregnancies: parseFloat(document.getElementById('pregnancies').value),
        glucose: parseFloat(document.getElementById('glucose').value),
        bloodpressure: parseFloat(document.getElementById('bloodpressure').value),
        skinthickness: parseFloat(document.getElementById('skinthickness').value),
        insulin: parseFloat(document.getElementById('insulin').value),
        bmi: parseFloat(document.getElementById('bmi').value),
        dpf: parseFloat(document.getElementById('dpf').value),
        age: parseFloat(document.getElementById('age').value)
    };
}

function validateInput(data) {
    if (Object.values(data).some(val => isNaN(val))) {
        alert("Please fill all fields before proceeding!");
        return false;
    }
    return true;
}

const riskLevels = {
    glucose: { low: 70, high: 140 },
    bmi: { low: 18.5, high: 24.9 },
    bloodpressure: { low: 60, high: 120 },
    insulin: { low: 2, high: 25 }
};

function getBarColor(value, type) {
    if (value < riskLevels[type].low) {
        return 'rgba(54, 162, 235, 0.8)';  // 🔵 Blue (Low Risk)
    } else if (value > riskLevels[type].high) {
        return 'rgba(255, 99, 132, 0.8)';  // 🔴 Red (High Risk)
    }
    return 'rgba(75, 192, 192, 0.8)';      // 🟢 Green (Normal)
}

// Generate Bar & Pie Charts
function generateCharts(data) {
    const labels = ["Pregnancies", "Glucose", "Blood Pressure", "Skin Thickness", "Insulin", "BMI", "DPF", "Age"];
    const values = Object.values(data);

    // Assign dynamic colors based on risk
    let barColors = [
        'rgba(153, 102, 255, 0.8)', // Static color for Pregnancies
        getBarColor(data.glucose, 'glucose'),
        getBarColor(data.bloodpressure, 'bloodpressure'),
        'rgba(255, 159, 64, 0.8)', // Static color for Skin Thickness
        getBarColor(data.insulin, 'insulin'),
        getBarColor(data.bmi, 'bmi'),
        'rgba(201, 203, 207, 0.8)', // Static color for DPF
        'rgba(46, 204, 113, 0.8)' // Static color for Age
    ];

    // Remove Old Charts
    if (myChart instanceof Chart) myChart.destroy();
    if (myPieChart instanceof Chart) myPieChart.destroy();

    // Bar Chart
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Your Diabetes Risk Factors',
                data: values,
                backgroundColor: barColors,
                borderColor: barColors.map(color => color.replace('0.8)', '1)')), // Darker border
                borderWidth: 1
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    // Pie Chart
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    myPieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ["Your Glucose", "Healthy Glucose", "Your BMI", "Healthy BMI", "Your BP", "Healthy BP", "Your Age", "Healthy Age"],
            datasets: [{
                data: [data.glucose, 90, data.bmi, 22, data.bloodpressure, 80, data.age, 30],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 
                                  'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 
                                  'rgba(201, 203, 207, 0.6)', 'rgba(46, 204, 113, 0.6)']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    
}

// Generate Health Insights
function generateInsights(data) {
    const healthyValues = { glucose: 90, bloodpressure: 80, bmi: 22, age: 30 };
    const insights = [];

    if (data.glucose > healthyValues.glucose) insights.push("⚠️ High glucose level increases diabetes risk.");
    else insights.push("✅ Your glucose is in the healthy range!");

    if (data.bmi > healthyValues.bmi) insights.push("⚠️ Your BMI is above normal. Consider a balanced diet.");
    else insights.push("✅ Your BMI is healthy!");

    if (data.bloodpressure > healthyValues.bloodpressure) insights.push("⚠️ High blood pressure can contribute to diabetes.");
    else insights.push("✅ Your blood pressure is at a healthy level!");

    if (data.age > healthyValues.age) insights.push("🔹 Older age increases diabetes risk. Stay active & eat well!");

    document.getElementById('insightsText').innerHTML = insights.join("<br>");
}

// Add color legend container to index.html
document.getElementById('chartContainer').insertAdjacentHTML('beforeend', '<div id="colorLegend" style="text-align: center; margin-top: 10px; font-size: 14px;"></div>');

const infoBox = document.getElementById("parameterInfo");

// Show Tooltip on Focus
function showInfo(event, field) {
    const infoText = {
        age: "Age is a risk factor because the likelihood of developing diabetes increases as you get older.",
        pregnancies: "More pregnancies might increase diabetes risk.",
        glucose: "High glucose levels indicate a higher risk.",
        bloodpressure: "High BP is linked to diabetes risk.",
        insulin: "Abnormal insulin levels can be a sign of insulin resistance, a condition often associated with diabetes.",
        bmi: "Higher BMI is a major diabetes risk factor.",
        skinthickness: "Body fat distribution relates to diabetes risk.",
        dpf: "Estimates genetic diabetes risk."
    };

    infoBox.textContent = infoText[field];
    infoBox.style.display = "block";

    // Position tooltip dynamically
    const rect = event.target.getBoundingClientRect();
    infoBox.style.left = `${rect.left + window.scrollX + rect.width / 2 - infoBox.clientWidth / 2}px`;
    infoBox.style.top = `${rect.top + window.scrollY - infoBox.clientHeight - 10}px`; // 10px above input
}

// Hide Tooltip on Blur
function hideInfo() {
    infoBox.style.display = "none";
}

// Attach event listeners dynamically
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", function(event) {
        showInfo(event, this.id);
    });
    input.addEventListener("blur", hideInfo);
});

// Hide tooltips when clicking Predict or View Insights
document.getElementById("predictionForm").addEventListener("submit", hideInfo);
document.getElementById("viewCharts").addEventListener("click", hideInfo);
