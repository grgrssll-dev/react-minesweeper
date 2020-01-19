import React, { useState } from 'react';
import styled from '@emotion/styled';

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
		<div className={`${props.className} menu`}>
			<ul className="menu__item">
				<li onClick={toggleMenu}>Game</li>
				{isMenuOpen && (
					<ul className="menu__submenu">
						<li className="menu__divider-bottom"
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
									className={level.name === currentLevel.name ? 'menu__item--selected' : ''}>{level.name}</li>
							);
						})}
					</ul>
				)}
			</ul>
		</div>
	);
}

export default styled(menu)`
	background: var(--system-bg);
	box-sizing: border-box;
	height: 1.5rem;
	padding: 0.375rem;
	position: relative;
	font-size: 0;

	.menu__item {
		margin: 0;
		padding: 0;
		font-size: 0;
	}

	.menu__item > li {
		color: var(--system-text);
		cursor: default;
		display: inline-block;
		font-size: 0.75rem;
		line-height: 1;
		vertical-align: baseline;
	}

	.menu__submenu {
		background: var(--system-bg);
		border-bottom-color: var(--system-border-dark);
		border-left-color: var(--system-border-light);
		border-right-color: var(--system-border-dark);
		border-style: solid;
		border-top-color: var(--system-border-light);
		border-width: 1px;
		left: 0;
		margin: 0;
		min-width: 9rem;
		padding: 0;
		position: absolute;
		top: 100%;
	}
	.menu__submenu > li {
		box-sizing: border-box;
		cursor: default;
		font-size: 0.75rem;
		list-style-type: none;
		padding: 0.375rem 0.375rem 0.375rem 1.375rem;
		position: relative;
	}

	.menu__submenu > li.menu__item--selected::before {
		content: '✓';
		display: block;
		position: absolute;
		top: 0.375rem;
		left: 0.375rem;
	}

	.menu__divider-bottom::after {
		content: '';
		display: block;
		position: absolute;
		top: 100%;
		left: 0.125rem;
		width: calc(100% - 0.25rem);
		height: 0;
		border-top: 0.0625rem var(--system-border-dark) solid;
		border-bottom: 0.0625rem var(--system-border-light) solid;
	}
`;
