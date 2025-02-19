import { useState } from 'react';
import '../styles.css';

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="tabs">
            <div className="tab-buttons">
                {React.Children.map(children, (child, index) => (
                    <button 
                        className={`tab-button ${index === activeTab ? 'active' : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {child.props.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {React.Children.map(children, (child, index) => (
                    index === activeTab ? child : null
                ))}
            </div>
        </div>
    );
};

export default Tabs;
