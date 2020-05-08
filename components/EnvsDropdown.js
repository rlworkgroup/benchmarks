import React, { useState } from 'react';

import styles from '../styles/EnvsDropdown.module.css'

function EnvsDropdown(props) {
    let envs = props.envs;
    let currentEnv = props.currentEnv;
    let setCurrentEnv = props.setCurrentEnv;
    const [envsDropdownActive, setEnvsDropdown] = useState(false);

    return (
        <div className={styles['section']}>
            <div className={[
                "dropdown" + ((envsDropdownActive === true) ? " is-active": ""),
                styles['dropdown']].join(' ')
            }>
                <div className="dropdown-trigger">
                    <button className={["button", styles['dropdown-button']].join(' ')}
                            aria-haspopup="true" aria-controls="dropdown-menu"
                            onClick={() => { setEnvsDropdown(!envsDropdownActive) }}>
                        <span>{currentEnv}</span>
                        <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"/>
                    </span>
                    </button>
                </div>
                <div className={["dropdown-menu", styles['dropdown-menu']].join(' ')} role="menu">
                    <div className={['dropdown-content', styles['dropdown-content']].join(' ')}>
                        {envs.map((item, index) => {
                            return(
                                <button className={["dropdown-item button is-white", styles['dropdown-item']].join(' ')}
                                        key={item}
                                        onClick={() => {
                                            setEnvsDropdown(false);
                                            setCurrentEnv(item);
                                        }}
                                >{item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnvsDropdown;
