document.addEventListener('DOMContentLoaded', () => {
  const otpDisplay = document.getElementById('otpDisplay');
  const regenerateOtpBtn = document.getElementById('regenerateOtpBtn');
  const toggleOtpBtn = document.getElementById('toggleOtpBtn');

  regenerateOtpBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/otp/reset', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al regenerar OTP');
      const data = await response.json();

      otpDisplay.textContent = data.otp;
      toggleOtpBtn.textContent = 'Ocultar';
      alert('OTP regenerado con éxito');

    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
});
