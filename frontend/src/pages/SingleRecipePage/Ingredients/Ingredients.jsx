import './Ingredients.css';

const Ingredients = ({recipeIngredients}) => {
    return (
        <div className="ingredients-container mb-5">
            <h2 className="text-[30.67px] font-bold text-[#D9D9D9] mb-5">Ingredients</h2>
            <ul className="ingredients-list">
                {recipeIngredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                        <div className="ingredient-content">
                            <p className="ingredient-name">{ingredient.name}</p>
                            <p className="ingredient-quantity">{ingredient.quantity} {ingredient.measurement}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Ingredients;