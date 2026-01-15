// ===================================
// Form Validation System
// ===================================

// Validation patterns
const VALIDATION_PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
};

// Validation rules
const VALIDATION_RULES = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: 'Le nom doit contenir entre 2 et 50 caractères'
    },
    email: {
        required: true,
        pattern: VALIDATION_PATTERNS.email,
        message: 'Veuillez entrer une adresse email valide'
    },
    password: {
        required: true,
        minLength: 6,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
    },
    passwordStrong: {
        required: true,
        minLength: 8,
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumber: true,
        hasSpecialChar: true,
        message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: 'Le message doit contenir entre 10 et 1000 caractères'
    },
    subject: {
        required: true,
        message: 'Veuillez sélectionner un sujet'
    }
};

// Validate field
function validateField(field, rules) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    removeFieldError(field);

    // Check required
    if (rules.required && !value) {
        isValid = false;
        errorMessage = 'Ce champ est obligatoire';
    }

    // Check min length
    if (isValid && rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = rules.message || `Ce champ doit contenir au moins ${rules.minLength} caractères`;
    }

    // Check max length
    if (isValid && rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        errorMessage = rules.message || `Ce champ ne doit pas dépasser ${rules.maxLength} caractères`;
    }

    // Check pattern
    if (isValid && rules.pattern && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = rules.message || 'Format invalide';
    }

    // Check password strength
    if (isValid && rules.hasUpperCase && !/[A-Z]/.test(value)) {
        isValid = false;
        errorMessage = rules.message || 'Le mot de passe doit contenir au moins une majuscule';
    }

    if (isValid && rules.hasLowerCase && !/[a-z]/.test(value)) {
        isValid = false;
        errorMessage = rules.message || 'Le mot de passe doit contenir au moins une minuscule';
    }

    if (isValid && rules.hasNumber && !/[0-9]/.test(value)) {
        isValid = false;
        errorMessage = rules.message || 'Le mot de passe doit contenir au moins un chiffre';
    }

    if (isValid && rules.hasSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        isValid = false;
        errorMessage = rules.message || 'Le mot de passe doit contenir au moins un caractère spécial';
    }

    // Update field state
    if (isValid) {
        setFieldValid(field);
    } else {
        setFieldError(field, errorMessage);
    }

    return isValid;
}

// Set field as valid
function setFieldValid(field) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    
    // Remove error message
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }

    // Add success icon
    let successIcon = field.parentElement.querySelector('.field-icon.success');
    if (!successIcon) {
        successIcon = document.createElement('span');
        successIcon.className = 'field-icon success';
        successIcon.innerHTML = '✓';
        field.parentElement.appendChild(successIcon);
    }
    successIcon.style.display = 'block';

    // Remove error icon
    const errorIcon = field.parentElement.querySelector('.field-icon.error');
    if (errorIcon) {
        errorIcon.style.display = 'none';
    }
}

// Set field as error
function setFieldError(field, message) {
    field.classList.remove('valid');
    field.classList.add('invalid');

    // Remove success icon
    const successIcon = field.parentElement.querySelector('.field-icon.success');
    if (successIcon) {
        successIcon.style.display = 'none';
    }

    // Add error icon
    let errorIcon = field.parentElement.querySelector('.field-icon.error');
    if (!errorIcon) {
        errorIcon = document.createElement('span');
        errorIcon.className = 'field-icon error';
        errorIcon.innerHTML = '✗';
        field.parentElement.appendChild(errorIcon);
    }
    errorIcon.style.display = 'block';

    // Add or update error message
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Remove field error
function removeFieldError(field) {
    field.classList.remove('invalid', 'valid');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    const errorIcon = field.parentElement.querySelector('.field-icon.error');
    if (errorIcon) {
        errorIcon.style.display = 'none';
    }
    const successIcon = field.parentElement.querySelector('.field-icon.success');
    if (successIcon) {
        successIcon.style.display = 'none';
    }
}

// Validate entire form
function validateForm(form, rules) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        const fieldName = field.name || field.id;
        if (rules[fieldName]) {
            if (!validateField(field, rules[fieldName])) {
                isValid = false;
            }
        }
    });

    return isValid;
}

// Initialize real-time validation
function initRealTimeValidation(form, rules) {
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        const fieldName = field.name || field.id;
        
        if (rules[fieldName]) {
            // Validate on blur
            field.addEventListener('blur', () => {
                validateField(field, rules[fieldName]);
            });

            // Validate on input (for better UX)
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid') || field.classList.contains('valid')) {
                    validateField(field, rules[fieldName]);
                }
            });
        }
    });
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        upperCase: /[A-Z]/.test(password),
        lowerCase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.values(checks).forEach(check => {
        if (check) strength++;
    });

    return {
        strength: strength,
        percentage: (strength / 5) * 100,
        level: strength <= 2 ? 'weak' : strength <= 3 ? 'medium' : 'strong',
        checks: checks
    };
}

// Update password strength indicator
function updatePasswordStrength(field, strengthIndicator) {
    if (!strengthIndicator) return;

    const password = field.value;
    const strength = checkPasswordStrength(password);

    // Update progress bar
    const progressBar = strengthIndicator.querySelector('.strength-progress');
    if (progressBar) {
        progressBar.style.width = strength.percentage + '%';
        progressBar.className = 'strength-progress ' + strength.level;
    }

    // Update text
    const strengthText = strengthIndicator.querySelector('.strength-text');
    if (strengthText) {
        const texts = {
            weak: 'Faible',
            medium: 'Moyen',
            strong: 'Fort'
        };
        strengthText.textContent = texts[strength.level] || '';
    }

    // Update checkmarks
    const checks = strengthIndicator.querySelectorAll('.strength-check');
    checks.forEach((check, index) => {
        const checkKeys = ['length', 'upperCase', 'lowerCase', 'number', 'specialChar'];
        if (strength.checks[checkKeys[index]]) {
            check.classList.add('checked');
        } else {
            check.classList.remove('checked');
        }
    });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        initRealTimeValidation,
        checkPasswordStrength,
        updatePasswordStrength,
        VALIDATION_RULES,
        VALIDATION_PATTERNS
    };
}
