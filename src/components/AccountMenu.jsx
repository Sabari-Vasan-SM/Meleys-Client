const Icon = ({ name }) => (
    <span className="material-symbols-outlined">{name}</span>
);

export function AccountMenu({ onOpenSettings, onLogout, onClose }) {
    return (
        <div className="account-menu-backdrop" onClick={onClose} role="presentation">
            <div className="account-menu" role="menu" aria-label="Account options" onClick={(event) => event.stopPropagation()}>
                <div className="account-menu__header">
                    <span className="account-menu__badge">EV</span>
                    <div>
                        <strong>Elena Vance</strong>
                        <p>Designer</p>
                    </div>
                </div>

                <button type="button" className="account-menu__item" onClick={onOpenSettings}>
                    <Icon name="settings" />
                    <span>Settings</span>
                </button>

                <button type="button" className="account-menu__item account-menu__item--destructive" onClick={onLogout}>
                    <Icon name="logout" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}