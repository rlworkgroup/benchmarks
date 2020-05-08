import styles from '../styles/Footer.module.css'

function Footer() {
    return (
        <footer className="footer">
            <div className={["content", styles['footer-content']].join(' ')}>
                <span className={["has-text-centered", styles['footer-item']].join(' ')}>
                    <a href="https://github.com/rlworkgroup/garage"
                       target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"/> Github
                    </a>
                </span>
                <span className={["has-text-centered", styles['footer-item']].join(' ')}>
                    <a href="https://github.com/rlworkgroup/garage/tree/master/tests/benchmarks"
                       target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-file-alt"/> Documentation
                    </a>
                </span>
            </div>
        </footer>
    );
}

export default Footer;
