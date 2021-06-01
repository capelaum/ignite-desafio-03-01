import React, { useState } from 'react';
import { useUtterances } from '../../hooks/useUtterances';

import styles from './comments.module.scss';

const commentNodeId = 'comments';

const Comments = () => {
  useUtterances(commentNodeId);
  return <div className={styles.comments} id={commentNodeId} />;
};

export default Comments;
