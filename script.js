async function downloadVideo() {
    const apiKey = "34fbc1eb1339f442394f24095b5e48a38ce41b97";
    const videoUrl = document.getElementById("videoUrl").value;
    const format = document.getElementById("format").value;
    
    if (!videoUrl) {
        alert("Please enter url...");
        return;
    }
    
    const encodedUrl = encodeURIComponent(videoUrl);
    const apiUrl = `https://loader.to/ajax/download.php?format=${format}&url=${encodedUrl}&api=${apiKey}`;
    
    document.getElementById("progressContainer").style.display = "block";
    document.getElementById("statusText").innerText = "Download Started....";
    
    try {
        console.log("Fetching API:", apiUrl);
        let response = await fetch(apiUrl);
        let data = await response.json();
        console.log("API Response:", data);
        
        if (data.id) {
            console.log("Download ID Received:", data.id);
            checkProgress(data.id);
        } else {
            document.getElementById("statusText").innerText = "त्रुटि! डाउनलोड प्रारंभ नहीं हुआ।";
        }
    } catch (error) {
        console.error("API त्रुटि:", error);
        document.getElementById("statusText").innerText = "API त्रुटि! पुनः प्रयास करें।";
        console.log(data)
    }
}

async function checkProgress(downloadId) {
    const progressUrl = `https://loader.to/ajax/progress.php?id=${downloadId}`;

    let progressInterval = setInterval(async () => {
        try {
            console.log("Checking progress:", progressUrl);
            let response = await fetch(progressUrl);
            let progressData = await response.json();
            console.log("Progress Data:", progressData);

            if (progressData.progress !== undefined) {
                let progressPercent = (progressData.progress / 10);
                document.getElementById("progressBar").value = progressPercent;
                document.getElementById("statusText").innerText = `डाउनलोड प्रगति: ${progressPercent.toFixed(1)}%`;

                if (progressData.progress >= 1000) {
                    clearInterval(progressInterval);
                    document.getElementById("statusText").innerText = "Link Generated";
                    
                    let downloadLink = document.createElement("a");
                    downloadLink.href = progressData.download_url;
                    downloadLink.innerText = "Download Now";
                    downloadLink.setAttribute("target", "_blank");

                    document.getElementById("downloadLinkContainer").innerHTML = "";
                    document.getElementById("downloadLinkContainer").appendChild(downloadLink);
                }
            } else {
                console.error("प्रगति डेटा में समस्या!", progressData);
            }
        } catch (error) {
            console.error("प्रगति जांच त्रुटि:", error);
            clearInterval(progressInterval);
            document.getElementById("statusText").innerText = "डाउनलोड प्रगति प्राप्त करने में त्रुटि हुई।";
        }
    }, 3000);
}

