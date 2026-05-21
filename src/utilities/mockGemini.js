/**
 * Simulated Gemini AI service for the DPRES platform.
 * Provides realistic responses for emergency safety scenarios, safety warnings, and student evaluation.
 */

export const mockGemini = {
  generate: async (prompt, systemInstruction = "") => {
    // Mimic API delay (600ms - 1200ms) for high-fidelity experience
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

    const promptLower = prompt.toLowerCase();

    // 1. Drill Alert Scenario Generator
    if (promptLower.includes("drill alert title") || promptLower.includes("emergency drill alert")) {
      const responses = [
        "Campus Protocol — Active Threat Drill in Progress",
        "Evacuation Directive — Emergency Fire Drill at Block A",
        "Weather Incident — Server Center Containment Protocol",
        "Emergency Broadcast — Monsoon Flood Warning Exercise",
        "Structural Emergency — Earthquake Evacuation Simulation"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // 2. Dynamic Lab Fire, Flood, Active Threat scenario generator
    if (promptLower.includes("scenario") && (promptLower.includes("emergency") || promptLower.includes("campus"))) {
      const scenarios = [
        "You are working in the chemical lab on the second floor when a beaker shatters and thick grey smoke starts billowing toward the doorway. The overhead fire alarm immediately sounds across the corridor.",
        "You are studying in the main library library when water starts leaking rapidly from the ceiling panels and rising water pools in the corridors. Security announces a local flash flood warning on campus.",
        "While attending a lecture in Block C, you hear three loud popping noises resembling gunshots in the courtyard below, followed by screams. The campus speakers announce an immediate active threat lockdown.",
        "You are in Block A computer laboratory when a violent tremor shakes the building, cracking wall plaster and knocking monitors off desks. Power goes out and a warning siren begins to wail."
      ];
      return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    // 3. Evaluation of student's response action
    if (promptLower.includes("evaluate") || promptLower.includes("action") || promptLower.includes("student's action")) {
      // Evaluate based on common positive safety keywords
      const hasEvac = promptLower.includes("exit") || promptLower.includes("evacuate") || promptLower.includes("stairs") || promptLower.includes("out");
      const hasHelp = promptLower.includes("call") || promptLower.includes("alert") || promptLower.includes("alarm") || promptLower.includes("contacts");
      const hasCover = promptLower.includes("cover") || promptLower.includes("drop") || promptLower.includes("table") || promptLower.includes("desk") || promptLower.includes("hold");
      const hasHide = promptLower.includes("lock") || promptLower.includes("silence") || promptLower.includes("hide") || promptLower.includes("block");
      const hasElevator = promptLower.includes("elevator") || promptLower.includes("lift");

      let score = 7.5;
      let review = "";

      if (hasElevator) {
        score = 3.0;
        review = "CRITICAL WARNING: Using the elevator during a structural or fire emergency is highly hazardous due to potential power failure and shaft smoke. Always use emergency exit stairwells instead.";
      } else if (promptLower.includes("fire") || promptLower.includes("smoke")) {
        if (hasEvac && hasHelp) {
          score = 9.8;
          review = "Excellent response! Activating the fire alarm and evacuating via the stairwell immediately minimizes risk. Alerting others on your way out shows excellent safety compliance.";
        } else if (hasEvac) {
          score = 8.5;
          review = "Good reaction. Evacuation should always be your immediate priority. Remember to pull the fire alarm on your exit path to ensure the whole building is notified.";
        } else {
          score = 5.0;
          review = "Caution: Staying inside or looking for belongings can lead to smoke inhalation. You should immediately drop under the smoke level and make your way to the nearest exit stairwell.";
        }
      } else if (promptLower.includes("quake") || promptLower.includes("shak")) {
        if (hasCover) {
          score = 9.5;
          review = "Perfect execution. Performing 'Drop, Cover, and Hold On' under a sturdy table shields you from falling debris. Do not attempt to run outside while shaking is in progress.";
        } else if (hasEvac) {
          score = 6.0;
          review = "Risk Alert: Running out during tremors increases your chance of injury from falling masonry or glass. It is safer to Drop, Cover, and Hold On inside, and evacuate once the shaking stops.";
        } else {
          score = 5.5;
          review = "Response needs improvement. Protect your head and torso immediately by crawling under a desk or positioning yourself near an interior wall away from glass panels.";
        }
      } else if (promptLower.includes("threat") || promptLower.includes("lockdown")) {
        if (hasHide && hasHelp) {
          score = 9.6;
          review = "Strong defensive actions. Locking the doors, barricading with desks, silencing phones, and turning off lights are critical for active threat evasion. Contact campus security only when safe.";
        } else if (hasHide) {
          score = 8.8;
          review = "Proper lockdown procedure. Blocking visual entry points and keeping quiet is the safest path when evacuation isn't viable. Make sure your phone is fully silenced (not just on vibrate).";
        } else {
          score = 4.5;
          review = "High risk option. Confronting the threat or crowding in hallways is highly dangerous. Prioritize running to safety if a clear path exists, otherwise hide, barricade, and prepare to defend.";
        }
      } else {
        score = 9.0;
        review = "Very rational and safety-compliant sequence. Prioritizing personal protection, maintaining situational awareness, and establishing emergency contact are key steps in university crisis standards.";
      }

      return `${review}\n\nSafety Rating: ${score}/10`;
    }

    return "Safety evaluation processed successfully. Recommendation: Maintain situational awareness and coordinate with campus fire wardens.";
  }
};
