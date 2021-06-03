import commonStyles from '../../styles/common.module.scss';

export function SocialFooter() {
  return (
    <span className={commonStyles.footerSocial}>
      Feito com ❤ por &nbsp;
      <a href="https://github.com/capelaum" target="_blank">
        Luís V. Capelletto
      </a>
    </span>
  );
}
