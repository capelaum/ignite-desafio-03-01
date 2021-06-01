import { useEffect } from 'react';

import styles from './comments.module.scss';

const addUtterancesScript = (
  parentElement,
  repo,
  label,
  issueTerm,
  theme,
  isIssueNumber
) => {
  const script = document.createElement('script');
  script.setAttribute('src', 'https://utteranc.es/client.js');
  script.setAttribute('crossorigin', 'anonymous');
  script.setAttribute('async', 'true');
  script.setAttribute('repo', repo);
  script.setAttribute('theme', theme);

  if (label !== '') {
    script.setAttribute('label', label);
  }

  if (isIssueNumber) {
    script.setAttribute('issue-number', issueTerm);
  } else {
    script.setAttribute('issue-term', issueTerm);
  }

  parentElement.appendChild(script);
};

const Comments = () => {
  const repo = 'capelaum/ignite-desafio-03-01';
  const theme = 'dark-blue';
  const issueTerm = 'pathname';
  const label = 'Comments';

  useEffect(() => {
    const commentsBox = document.getElementById('commentsBox');

    // Check if comments box is loaded
    if (!commentsBox) {
      return;
    }

    // Get utterances
    const utterances = document.getElementsByClassName('utterances')[0];

    // Remove utterances if it exists
    if (utterances) {
      utterances.remove();
    }

    // Add utterances script
    addUtterancesScript(commentsBox, repo, label, issueTerm, theme, false);
  });

  return <div className={styles.comments} id="commentsBox" />;
};

export default Comments;
