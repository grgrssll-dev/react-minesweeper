import React, { useState } from 'react';
import './Menu.css';

function menu(props) {
	console.log('-- menu render');
	const [isMenuOpen, setMenuOpen] = useState(false);
	const { levels, currentLevel, onLevelChange, onNewGame } = props;

	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setMenuOpen(false);
	};

	return (
		<div className="menu">
			<ul className="menu--item">
				<li onClick={toggleMenu}>Game</li>
				{isMenuOpen && (
					<ul className="menu--submenu">
						<li className="menu--divider-bottom"
							onClick={() => {
								closeMenu();
								onNewGame();
							}}>New</li>
						{Object.values(levels).map((level) => {
							return (
								<li key={level.name}
									onClick={() => {
										closeMenu();
										onLevelChange(level)
									}}
									className={level.name === currentLevel.name ? 'selected' : ''}>{level.name}</li>
							);
						})}
					</ul>
				)}
			</ul>
		</div>
	);
}

export default menu;
