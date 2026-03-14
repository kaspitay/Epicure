import './Steps.css';

const Steps = ({ recipeSteps }) => {
    return (
        <div className="steps-container mb-5 overflow-y-auto max-h-400px scrollbar-none">
            <h2 className="text-[30.67px] font-bold text-[#D9D9D9] mb-5">Steps</h2>
            <ul className="steps-list">
                {recipeSteps.map((step, index) => (
                    <li key={index} className="step-item">
                        <div className="step-content">
                            <div className="step-description">
                                <p className="text-white font-poppins">{step.description}</p>
                            </div>
                            {step.stepImage && (
                                <div className="step-image">
                                    <img
                                        src={step.stepImage}
                                        alt={`Step ${index + 1}`}
                                    />
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Steps;