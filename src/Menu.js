import React, { PureComponent } from 'react';
import './Menu.css';

class Menu extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			isMenuOpen: false
		};
	}

	_toggleMenu() {
		this.setState((state) => {
			return {
				isMenuOpen: !state.isMenuOpen
			};
		});
	}

	_closeMenu() {
		this.setState({
			isMenuOpen: false
		});
	}

	render() {
		console.log('-- menu render');
		const { levels, currentLevel, onLevelChange, onNewGame } = this.props;
		const { isMenuOpen } = this.state;
		return (
			<div className="menu">
				<ul className="menu--item">
					<li onClick={() => {
						this._toggleMenu();
					}}>Game</li>
					{isMenuOpen && (
						<ul className="menu--submenu">
							<li className="menu--divider-bottom"
								onClick={() => {
									this._closeMenu();
									onNewGame();
								}}>New</li>
							{Object.values(levels).map((level) => {
								return (
									<li key={level.name}
										onClick={() => {
											this._closeMenu();
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
}

export default Menu;
