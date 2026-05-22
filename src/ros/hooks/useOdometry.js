import { useTopic } from './useTopic';
import { TOPICS } from '../topics';

export function useOdometry() {
  const { msg, connected } = useTopic(
    TOPICS.ODOM,
    'nav_msgs/Odometry',
    { throttleMs: 100 }
  );

  if (!msg) return { data: null, connected };

  return {
    connected,
    data: {
      position: {
        x: msg.pose.pose.position.x,
        y: msg.pose.pose.position.y,
        z: msg.pose.pose.position.z,
      },
      orientation: {
        x: msg.pose.pose.orientation.x,
        y: msg.pose.pose.orientation.y,
        z: msg.pose.pose.orientation.z,
        w: msg.pose.pose.orientation.w,
      },
      velocity: {
        linear:  msg.twist.twist.linear.x,
        angular: msg.twist.twist.angular.z,
      }
    }
  };
}