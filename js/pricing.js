// Simple Pricing Section Animations
document.addEventListener('DOMContentLoaded', function() {
  // Fade in animation for pricing cards
  const pricingCards = document.querySelectorAll('.pricing-card');  // Update all pricing card CTA buttons
  const pricingCtaButtons = document.querySelectorAll('.pricing-card a[href="#kontakt"]');
  pricingCtaButtons.forEach(button => {
    // Clear existing content
    button.innerHTML = '';
    
    // Create new content with improved text
    const newContent = document.createElement('div');
    newContent.className = 'flex items-center justify-center';
    
    // Single line text with slash
    const mainText = document.createElement('span');
    mainText.textContent = 'Kostenloser Erstentwurf / Anfrage starten';
    mainText.className = 'font-medium text-white tracking-tight';
    
    // Add elements to the button
    newContent.appendChild(mainText);
    button.appendChild(newContent);
  });

  pricingCards.forEach((card, index) => {
    // Initial state (invisible)
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    // Animate in with delay based on index
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 + (index * 150));
  });  // Interactive expandable package finder
  const packageComparisonHeader = document.querySelector('.package-comparison-header');
  const packageComparisonContent = document.querySelector('.package-comparison-content');
  const packageComparisonArrow = document.querySelector('.package-comparison-arrow');
  
  if (packageComparisonHeader && packageComparisonContent) {
    // Remove initial hidden class and replace with our custom implementation
    packageComparisonContent.classList.remove('hidden');
    
    // Set initial state
    let isOpen = false;
    
    packageComparisonHeader.addEventListener('click', function() {
      isOpen = !isOpen;
      
      if (isOpen) {
        // Open dropdown
        packageComparisonContent.classList.add('active');
        
        // Rotate arrow
        if (packageComparisonArrow) {
          packageComparisonArrow.style.transform = 'rotate(180deg)';
        }
      } else {
        // Close dropdown
        packageComparisonContent.classList.remove('active');
        
        // Rotate arrow back
        if (packageComparisonArrow) {
          packageComparisonArrow.style.transform = 'rotate(0deg)';
        }
      }
    });
    
    // Package Finder Wizard Functionality
    const packageFinder = {
      currentStep: 1,      selections: {
        vereinsgroesse: '',
        inhaltspflege: '',
        aktualisierung: '',
        budget: '',
        funktionen: []
      },
      steps: document.querySelectorAll('.package-finder-step'),
      
      init: function() {
        // Initialize the steps
        this.showStep(1);
        
        // Event listeners for navigation buttons
        document.querySelectorAll('.package-finder-next').forEach(button => {
          button.addEventListener('click', () => this.nextStep());
        });
        
        document.querySelectorAll('.package-finder-prev').forEach(button => {
          button.addEventListener('click', () => this.prevStep());
        });        // Option selection listeners for all radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(input => {
          // Make parent label clickable
          const label = input.closest('.finder-option-item');
          label.addEventListener('click', () => {
            input.checked = true;
            
            // Trigger change event
            const event = new Event('change');
            input.dispatchEvent(event);
          });
          
          input.addEventListener('change', (e) => {
            const nextButton = e.target.closest('.package-finder-step').querySelector('.package-finder-next');
            nextButton.disabled = false;
            
            // Store selection in the appropriate property based on input name
            const name = e.target.name;
            const value = e.target.value;
            
            // Make sure the property exists in selections
            if (!this.selections[name]) {
              this.selections[name] = '';
            }
            
            this.selections[name] = value;
          });
        });
        
        // Checkbox selection listeners with improved interaction
        document.querySelectorAll('input[name="funktionen"]').forEach(checkbox => {
          // Make parent label clickable for checkboxes too
          const label = checkbox.closest('.finder-option-item');
          label.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            
            // Trigger change event
            const event = new Event('change');
            checkbox.dispatchEvent(event);
          });
          
          checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
              this.selections.funktionen.push(e.target.value);
            } else {
              const index = this.selections.funktionen.indexOf(e.target.value);
              if (index > -1) {
                this.selections.funktionen.splice(index, 1);
              }
            }
          });
        });
      },
      
      showStep: function(stepNumber) {
        // Hide current step
        this.steps.forEach(step => {
          step.classList.remove('active');
        });
        
        // Show requested step
        const nextStep = document.querySelector(`.package-finder-step[data-step="${stepNumber}"]`);
        if (nextStep) {
          nextStep.classList.add('active');
          this.currentStep = stepNumber;
        }
      },
      
      nextStep: function() {
        // If we're at the last step before results, calculate and show results
        if (this.currentStep === 4) {
          this.calculateRecommendation();
        }
        
        this.showStep(this.currentStep + 1);
      },
      
      prevStep: function() {
        // If we're at the results step, go back to start
        if (this.currentStep === 5) {
          this.showStep(1);
          this.resetSelections();
          return;
        }
        
        // Otherwise go back one step
        this.showStep(this.currentStep - 1);
      },
        resetSelections: function() {
        // Reset all selections
        this.selections = {
          vereinsgroesse: '',
          inhaltspflege: '',
          aktualisierung: '',
          budget: '',
          funktionen: []
        };
        
        // Reset all radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });
        
        // Reset all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
          checkbox.checked = false;
        });
        
        // Reset next buttons
        document.querySelectorAll('.package-finder-next').forEach(button => {
          const stepEl = button.closest('.package-finder-step');
          if (stepEl && stepEl.dataset.step !== '1' && stepEl.dataset.step !== '5') {
            button.disabled = true;
          }
        });
      },
        calculateRecommendation: function() {
        // Simple scoring system for packages
        let basicScore = 0;
        let standardScore = 0;
        let premiumScore = 0;
        
        // Vereinsgröße (Website-Ziel)
        if (this.selections.vereinsgroesse === 'klein') {
          basicScore += 4;
          standardScore += 1;
        } else if (this.selections.vereinsgroesse === 'mittel') {
          basicScore += 1;
          standardScore += 4;
          premiumScore += 1;
        } else if (this.selections.vereinsgroesse === 'gross') {
          standardScore += 1;
          premiumScore += 4;
        }
        
        // Vereinsgröße (Mitglieder)
        if (this.selections.inhaltspflege === 'selten') {
          basicScore += 3;
          standardScore += 1;
        } else if (this.selections.inhaltspflege === 'regelmaessig') {
          basicScore += 1;
          standardScore += 3;
          premiumScore += 1;
        } else if (this.selections.inhaltspflege === 'haeufig') {
          standardScore += 1;
          premiumScore += 3;
        }
        
        // Aktualisierungshäufigkeit
        if (this.selections.aktualisierung === 'selten') {
          basicScore += 3;
          standardScore += 1;
        } else if (this.selections.aktualisierung === 'regelmaessig') {
          basicScore += 1;
          standardScore += 3;
          premiumScore += 1;
        } else if (this.selections.aktualisierung === 'haeufig') {
          standardScore += 1;
          premiumScore += 3;
        }
        
        // Budget
        if (this.selections.budget === 'klein') {
          basicScore += 4;
        } else if (this.selections.budget === 'mittel') {
          standardScore += 4;
        } else if (this.selections.budget === 'gross') {
          premiumScore += 4;
        }
        
        // Funktionen
        this.selections.funktionen.forEach(funktion => {
          if (funktion === 'kontaktformular') {
            // Alle Pakete haben Kontaktformular
            basicScore += 1;
            standardScore += 1;
            premiumScore += 1;
          } else if (funktion === 'news') {
            // News ist in Standard und Premium enthalten
            standardScore += 2;
            premiumScore += 1;
          } else if (funktion === 'kalender') {
            // Kalender ist in Standard und Premium enthalten
            standardScore += 2;
            premiumScore += 1;
          } else if (funktion === 'mitgliederbereich') {
            // Mitgliederbereich nur in Premium
            premiumScore += 3;
          }
        });
        
        // Determine highest score and update recommendation
        let recommendedPackage = '';
        let highestScore = Math.max(basicScore, standardScore, premiumScore);
        
        if (highestScore === basicScore) {
          recommendedPackage = 'basic';
        } else if (highestScore === standardScore) {
          recommendedPackage = 'standard';
        } else {
          recommendedPackage = 'premium';
        }
        
        // Update recommendation display
        this.updateRecommendation(recommendedPackage);
      },        updateRecommendation: function(package) {
        const titleElement = document.getElementById('recommendation-title');
        const descElement = document.getElementById('recommendation-description');
        const priceElement = document.getElementById('recommendation-price');
        const featuresElement = document.getElementById('recommendation-features');
        
        // Clear existing features
        featuresElement.innerHTML = '';
        
        // Generate tailored description based on user selections
        let tailoredDescription = this.generateTailoredDescription(package);
        
        if (package === 'basic') {
          titleElement.textContent = 'Basis-Paket';
          descElement.textContent = tailoredDescription;
          priceElement.textContent = '150€';
          
          // Add features
          this.addFeature(featuresElement, 'Responsive Design für alle Geräte (Smartphone, Tablet, PC)');
          this.addFeature(featuresElement, 'Optimiertes Kontaktformular mit Spam-Schutz');
          this.addFeature(featuresElement, 'SEO-Grundoptimierung für bessere Sichtbarkeit');
          this.addFeature(featuresElement, 'Domain & professionelle E-Mail-Adressen inklusive');
          this.addFeature(featuresElement, 'Einfache Inhaltsseiten mit Text und Bildern');
          
        } else if (package === 'standard') {
          titleElement.textContent = 'Standard-Paket';
          descElement.textContent = tailoredDescription;
          priceElement.textContent = '300€';
          
          // Add features
          this.addFeature(featuresElement, 'Content-Management-System zur selbstständigen Aktualisierung');
          this.addFeature(featuresElement, 'News-Bereich für Vereinsneuigkeiten mit Bildgalerie');
          this.addFeature(featuresElement, 'Interaktiver Veranstaltungskalender');
          this.addFeature(featuresElement, 'Social Media Integration für mehr Reichweite');
          this.addFeature(featuresElement, 'Erweiterte SEO-Optimierung mit Analytics');
          this.addFeature(featuresElement, 'Datenschutz-konformes Cookie-Banner');
          
        } else {
          titleElement.textContent = 'Premium-Paket';
          descElement.textContent = tailoredDescription;
          priceElement.textContent = '900€';
          
          // Add features
          this.addFeature(featuresElement, 'Alle Funktionen aus dem Standard-Paket');
          this.addFeature(featuresElement, 'Geschützter Mitgliederbereich mit Login-System');
          this.addFeature(featuresElement, 'Online-Mitgliederverwaltung mit Rollen und Rechten');
          this.addFeature(featuresElement, 'Integriertes Zahlungssystem für Beiträge');
          this.addFeature(featuresElement, 'Professionelles Spendensystem mit Zahlungsabwicklung');
          this.addFeature(featuresElement, 'Newsletter-System mit Anmelde-Formular');
          this.addFeature(featuresElement, 'Premium Support & Online-Schulung für Administratoren');
        }
      },
        addFeature: function(container, text) {
        const li = document.createElement('li');
        li.className = 'flex items-start';
        li.innerHTML = `
          <svg class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>${text}</span>
        `;
        container.appendChild(li);
      },      generateTailoredDescription: function(package) {
        // Create an AI-like response that analyzes all answers regardless of package
        
        // Get information about user's selections
        const webGoal = this.getWebsiteGoalText(this.selections.vereinsgroesse);
        const vereinsGroesse = this.getVereinGroesseText(this.selections.inhaltspflege);
        const updateFrequency = this.getUpdateFrequencyText(this.selections.aktualisierung);
        const features = this.getFeaturesText(this.selections.funktionen);
        const budgetLevel = this.getBudgetText(this.selections.budget);
        
        // Check for mismatches between user selections and recommended package
        const mismatches = this.checkForMismatches(package);
        
        // Get the fully comprehensive reasoning that includes ALL factors
        const recommendation = this.generateReasoning(package, webGoal, vereinsGroesse, updateFrequency, features, budgetLevel, mismatches);
        
        return recommendation;
      },
      
      getWebsiteGoalText: function(goal) {
        switch(goal) {
          case 'klein':
            return {
              key: "einfache_praesenz",
              text: "eine einfache Präsenz mit grundlegenden Informationen zum Verein"
            };
          case 'mittel':
            return {
              key: "regelmaessige_kommunikation",
              text: "regelmäßige Kommunikation mit News und Terminen"
            };
          case 'gross':
            return {
              key: "umfassende_plattform",
              text: "eine umfassende digitale Plattform mit Mitgliederverwaltung"
            };
          default:
            return {
              key: "undefined",
              text: "eine Website für Ihren Verein"
            };
        }
      },
      
      getVereinGroesseText: function(size) {
        switch(size) {
          case 'selten':
            return {
              key: "klein",
              text: "einen kleineren Verein mit lokalem Fokus"
            };
          case 'regelmaessig':
            return {
              key: "mittel",
              text: "einen mittelgroßen Verein mit regionaler Bedeutung"
            };
          case 'haeufig':
            return {
              key: "gross",
              text: "einen größeren Verein mit überregionalen Aktivitäten"
            };
          default:
            return {
              key: "undefined",
              text: "Ihren Verein"
            };
        }
      },
      
      getUpdateFrequencyText: function(frequency) {
        switch(frequency) {
          case 'selten':
            return {
              key: "selten",
              text: "nur selten aktualisiert mit wenigen Änderungen pro Jahr"
            };
          case 'regelmaessig':
            return {
              key: "regelmaessig",
              text: "monatlich durch ausgewählte Personen aktualisiert"
            };
          case 'haeufig':
            return {
              key: "haeufig",
              text: "häufig durch mehrere Vereinsmitglieder aktualisiert"
            };
          default:
            return {
              key: "undefined",
              text: "gelegentlich aktualisiert"
            };
        }
      },
      
      getFeaturesText: function(features) {
        const featureTexts = [];
        const featureKeys = [];
        
        if (features.includes('kontaktformular')) {
          featureTexts.push("ein optimiertes Kontaktformular");
          featureKeys.push("kontaktformular");
        }
        
        if (features.includes('news')) {
          featureTexts.push("einen News-Bereich");
          featureKeys.push("news");
        }
        
        if (features.includes('kalender')) {
          featureTexts.push("einen interaktiven Veranstaltungskalender");
          featureKeys.push("kalender");
        }
        
        if (features.includes('mitgliederbereich')) {
          featureTexts.push("einen geschützten Mitgliederbereich");
          featureKeys.push("mitgliederbereich");
        }
        
        return {
          keys: featureKeys,
          text: featureTexts.length ? featureTexts.join(", ") : "grundlegende Features"
        };
      },
      
      getBudgetText: function(budget) {
        switch(budget) {
          case 'klein':
            return {
              key: "klein",
              text: "bis zu 200€ für eine einfache Website"
            };
          case 'mittel':
            return {
              key: "mittel",
              text: "zwischen 200€ und 500€ für eine Website mit Content-Management"
            };
          case 'gross':
            return {
              key: "gross",
              text: "über 500€ für eine umfassende Vereinslösung"
            };
          default:
            return {
              key: "undefined",
              text: "ein angemessenes Budget für eine Vereinswebsite"
            };
        }
      },
        // Package details now integrated in the generateReasoning function
      
      checkForMismatches: function(package) {
        const mismatches = [];
        
        // Check for goal mismatches
        if ((this.selections.vereinsgroesse === 'gross' && package === 'basic') || 
            (this.selections.vereinsgroesse === 'klein' && package === 'premium')) {
          mismatches.push("webgoal");
        }
        
        // Check for size mismatches
        if ((this.selections.inhaltspflege === 'haeufig' && package === 'basic') || 
            (this.selections.inhaltspflege === 'selten' && package === 'premium')) {
          mismatches.push("size");
        }
        
        // Check for update frequency mismatches
        if ((this.selections.aktualisierung === 'haeufig' && package === 'basic') || 
            (this.selections.aktualisierung === 'selten' && package === 'premium')) {
          mismatches.push("updates");
        }
        
        // Check for feature mismatches
        if ((this.selections.funktionen.includes('mitgliederbereich') && package !== 'premium') ||
            ((this.selections.funktionen.includes('news') || this.selections.funktionen.includes('kalender')) && package === 'basic')) {
          mismatches.push("features");
        }
        
        // Check for budget mismatches
        if ((this.selections.budget === 'klein' && package !== 'basic') || 
            (this.selections.budget === 'gross' && package !== 'premium')) {
          mismatches.push("budget");
        }
        
        return mismatches;
      },
        generateReasoning: function(package, webGoal, vereinsGroesse, updateFrequency, features, budgetLevel, mismatches) {
        // This is the completely redesigned reasoning generator that ensures ALL user inputs are considered
        // and creates a comprehensive, customized recommendation
        
        // Create a summary of all selections to ensure we consider everything
        const allSelections = {
          webGoal: webGoal,
          vereinsGroesse: vereinsGroesse,
          updateFrequency: updateFrequency,
          features: features,
          budgetLevel: budgetLevel
        };
        
        // Create different paragraphs addressing different aspects
        const paragraphs = [];
        
        // First paragraph: Introduction combining website goal and association size
        let introParagraph = "";
        if (webGoal.key !== "undefined" && vereinsGroesse.key !== "undefined") {
          if ((package === 'basic' && webGoal.key === "einfache_praesenz" && vereinsGroesse.key === "klein") || 
              (package === 'standard' && webGoal.key === "regelmaessige_kommunikation" && vereinsGroesse.key === "mittel") ||
              (package === 'premium' && webGoal.key === "umfassende_plattform" && vereinsGroesse.key === "gross")) {
            // Perfect match scenario
            introParagraph = `Als ${vereinsGroesse.text} mit dem Ziel, ${webGoal.text} zu erstellen, bietet unser ${this.getPackageDisplayName(package)} die optimale Kombination an Funktionen. `;
          } else {
            // Mixed match scenario
            introParagraph = `Sie leiten ${vereinsGroesse.text} und benötigen ${webGoal.text}. `;
            
            if (mismatches.includes("webgoal") || mismatches.includes("size")) {
              introParagraph += `Basierend auf der Gesamtheit Ihrer Antworten ist unser ${this.getPackageDisplayName(package)} die beste Gesamtlösung für Ihre Bedürfnisse. `;
            } else {
              introParagraph += `Unser ${this.getPackageDisplayName(package)} bietet die passende Balance zwischen Funktionalität und Benutzerfreundlichkeit für Ihre spezifischen Anforderungen. `;
            }
          }
          paragraphs.push(introParagraph);
        }
        
        // Second paragraph: Update frequency and content management needs
        let updateParagraph = "";
        if (updateFrequency.key !== "undefined") {
          updateParagraph = `Ihre Website wird ${updateFrequency.text}. `;
          
          if (package === 'basic' && updateFrequency.key === "selten") {
            updateParagraph += `Bei selteneren Updates ist unser ${this.getPackageDisplayName(package)} mit seiner unkomplizierten Struktur ideal für Sie. `;
          } else if (package === 'standard' && (updateFrequency.key === "regelmaessig" || updateFrequency.key === "haeufig")) {
            updateParagraph += `Das integrierte Content-Management-System im ${this.getPackageDisplayName(package)} ermöglicht Ihnen die einfache und selbstständige Pflege Ihrer Inhalte. `;
          } else if (package === 'premium' && (updateFrequency.key === "regelmaessig" || updateFrequency.key === "haeufig")) {
            updateParagraph += `Das erweiterte Redaktionssystem im ${this.getPackageDisplayName(package)} unterstützt das Management durch mehrere Benutzer mit unterschiedlichen Berechtigungen. `;
          } else if (package === 'basic' && (updateFrequency.key === "regelmaessig" || updateFrequency.key === "haeufig")) {
            updateParagraph += `Obwohl Sie regelmäßige Aktualisierungen planen, kann unser ${this.getPackageDisplayName(package)} ein kostengünstiger Einstieg sein, den Sie später erweitern können. `;
          } else if ((package === 'standard' || package === 'premium') && updateFrequency.key === "selten") {
            updateParagraph += `Auch wenn Sie seltener Updates planen, bietet unser ${this.getPackageDisplayName(package)} zusätzliche Funktionen, die Ihrem Verein langfristig zugutekommen können. `;
          }
          
          paragraphs.push(updateParagraph);
        }
        
        // Third paragraph: Features and functionality
        let featuresParagraph = "";
        if (features.keys.length > 0) {
          if (features.keys.length === 1 && features.keys.includes("kontaktformular")) {
            featuresParagraph = `Ein optimiertes Kontaktformular ist in allen unseren Paketen enthalten, auch im ${this.getPackageDisplayName(package)}. `;
          } else {
            featuresParagraph = `Sie benötigen ${features.text}. `;
            
            if (package === 'basic' && (features.keys.includes("news") || features.keys.includes("kalender") || features.keys.includes("mitgliederbereich"))) {
              featuresParagraph += `Obwohl einige Ihrer gewünschten Funktionen in höheren Paketen enthalten sind, kann das ${this.getPackageDisplayName(package)} ein guter Ausgangspunkt sein, mit der Möglichkeit eines späteren Upgrades. `;
            } else if (package === 'standard' && features.keys.includes("mitgliederbereich")) {
              featuresParagraph += `Der gewünschte Mitgliederbereich ist zwar eine Premium-Funktion, aber unser ${this.getPackageDisplayName(package)} bietet bereits viele fortgeschrittene Funktionen wie News-Bereich und Kalender. `;
            } else if (package === 'standard' && (features.keys.includes("news") || features.keys.includes("kalender"))) {
              featuresParagraph += `Unser ${this.getPackageDisplayName(package)} enthält alle diese Funktionen und bietet einen idealen Kompromiss zwischen Umfang und Kosten. `;
            } else if (package === 'premium') {
              featuresParagraph += `Unser ${this.getPackageDisplayName(package)} bietet nicht nur alle von Ihnen gewünschten Funktionen, sondern auch erweiterte Möglichkeiten für zukünftiges Wachstum Ihres Vereins. `;
            }
          }
          
          paragraphs.push(featuresParagraph);
        }
        
        // Fourth paragraph: Budget considerations and value
        let budgetParagraph = "";
        if (budgetLevel.key !== "undefined") {
          budgetParagraph = `Sie haben ein Budget von ${budgetLevel.text} angegeben. `;
          
          if ((package === 'basic' && budgetLevel.key === "klein") ||
              (package === 'standard' && budgetLevel.key === "mittel") ||
              (package === 'premium' && budgetLevel.key === "gross")) {
            // Budget matches package
            budgetParagraph += `Das ${this.getPackageDisplayName(package)} passt perfekt in diesen Rahmen und bietet Ihnen ein ausgezeichnetes Preis-Leistungs-Verhältnis. `;
          } else if ((package === 'standard' || package === 'premium') && budgetLevel.key === "klein") {
            // Budget is smaller than package
            budgetParagraph += `Das ${this.getPackageDisplayName(package)} liegt zwar über Ihrem angegebenen Budgetrahmen, bietet jedoch wichtige Funktionen, die für Ihre anderen Anforderungen unerlässlich sind. Gerne beraten wir Sie zu Finanzierungsmöglichkeiten. `;
          } else if (package === 'basic' && (budgetLevel.key === "mittel" || budgetLevel.key === "gross")) {
            // Budget is higher than package
            budgetParagraph += `Mit Ihrem Budget könnten Sie auch ein höherwertiges Paket in Betracht ziehen, aber das ${this.getPackageDisplayName(package)} erfüllt Ihre aktuellen Grundbedürfnisse bereits sehr effizient. `;
          }
          
          paragraphs.push(budgetParagraph);
        }
        
        // Final recommendation paragraph that ties everything together
        let finalParagraph = "";
        
        // Count how many factors align with the recommendation
        let alignedFactors = 0;
        if (package === 'basic' && webGoal.key === "einfache_praesenz") alignedFactors++;
        if (package === 'standard' && webGoal.key === "regelmaessige_kommunikation") alignedFactors++;
        if (package === 'premium' && webGoal.key === "umfassende_plattform") alignedFactors++;
        
        if (package === 'basic' && vereinsGroesse.key === "klein") alignedFactors++;
        if (package === 'standard' && vereinsGroesse.key === "mittel") alignedFactors++;
        if (package === 'premium' && vereinsGroesse.key === "gross") alignedFactors++;
        
        if (package === 'basic' && updateFrequency.key === "selten") alignedFactors++;
        if (package === 'standard' && updateFrequency.key === "regelmaessig") alignedFactors++;
        if (package === 'premium' && updateFrequency.key === "haeufig") alignedFactors++;
        
        if (package === 'basic' && budgetLevel.key === "klein") alignedFactors++;
        if (package === 'standard' && budgetLevel.key === "mittel") alignedFactors++;
        if (package === 'premium' && budgetLevel.key === "gross") alignedFactors++;
        
        if (package === 'basic' && features.keys.length <= 1 && !features.keys.includes("news") && !features.keys.includes("kalender") && !features.keys.includes("mitgliederbereich")) alignedFactors++;
        if (package === 'standard' && (features.keys.includes("news") || features.keys.includes("kalender")) && !features.keys.includes("mitgliederbereich")) alignedFactors++;
        if (package === 'premium' && features.keys.includes("mitgliederbereich")) alignedFactors++;
        
        const totalFactors = 5; // webGoal, vereinsGroesse, updateFrequency, features, budgetLevel
        const alignmentPercentage = Math.round((alignedFactors / totalFactors) * 100);
        
        if (alignmentPercentage >= 80) {
          finalParagraph = `Zusammenfassend ist das ${this.getPackageDisplayName(package)} hervorragend auf Ihre Bedürfnisse abgestimmt. Es berücksichtigt alle Ihre wichtigen Anforderungen und bietet die optimale Balance zwischen Funktionsumfang und Kosten.`;
        } else if (alignmentPercentage >= 60) {
          finalParagraph = `Nach Abwägung aller Faktoren - Ihres Websiteziels, der Vereinsgröße, der Aktualisierungshäufigkeit, der gewünschten Funktionen und Ihres Budgets - empfehlen wir das ${this.getPackageDisplayName(package)} als die beste Gesamtlösung für Ihre Bedürfnisse.`;
        } else {
          finalParagraph = `Unter Berücksichtigung aller Ihrer Antworten haben wir das ${this.getPackageDisplayName(package)} als Empfehlung ausgewählt. In einem persönlichen Gespräch können wir die Lösung noch genauer auf Ihre spezifischen Bedürfnisse abstimmen und alternative Optionen besprechen.`;
        }
        
        paragraphs.push(finalParagraph);
        
        return paragraphs.join(" ");
      },
      
      getPackageDisplayName: function(package) {
        switch(package) {
          case 'basic': return 'Basis-Paket';
          case 'standard': return 'Standard-Paket';
          case 'premium': return 'Premium-Paket';
          default: return package + '-Paket';
        }
      }
    };
    
    // Initialize Package Finder
    packageFinder.init();
  }
  // Smooth scroll for pricing CTA buttons
  const ctaButtons = document.querySelectorAll('#preise a[href^="#"]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});
