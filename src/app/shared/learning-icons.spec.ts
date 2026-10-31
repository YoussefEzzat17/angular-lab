import { TOPICS } from '../core/data/topics';
import { TOPIC_ILLUSTRATIONS } from './learning-icons';

describe('TOPIC_ILLUSTRATIONS', () => {
  it('has a drawing for every lesson', () => {
    for (const topic of TOPICS) {
      expect(TOPIC_ILLUSTRATIONS[topic.id]).withContext(topic.id).toBeDefined();
    }
  });
});
