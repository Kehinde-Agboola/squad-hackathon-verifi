import { useEffect, useRef } from 'react';
import { verifyService } from '@/services/verifyService';
import { useVerifyStore, CheckProgress } from '@/store/useVerifyStore';

export const useVerification = (verificationId: string | null, enabled: boolean = true) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { updateCheckProgress, setTrustScore } = useVerifyStore();

  useEffect(() => {
    if (!verificationId || !enabled) return;

    const poll = async () => {
      try {
        const status = await verifyService.getStatus(verificationId);

        if (status.checks) {
          const checks: CheckProgress[] = status.checks.map((check: any) => ({
            id: check.id,
            name: check.name,
            status: check.status,
            percentage: check.percentage || 0,
            reason: check.reason,
          }));
          updateCheckProgress(checks);
        }

        if (status.trustScore !== undefined) {
          setTrustScore(status.trustScore);
        }

        if (status.status === 'completed' || status.status === 'failed') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      } catch (error) {
        console.error('Failed to fetch verification status:', error);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [verificationId, enabled, updateCheckProgress, setTrustScore]);
};
