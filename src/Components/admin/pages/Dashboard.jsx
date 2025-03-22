import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Typography, CircularProgress } from '@mui/material';
import { Users, BookOpen, CreditCard, Newspaper } from 'lucide-react';
import CountService from '../../../services/countService';

function StatCard({ title, value, icon: Icon }) {
  const [displayValue, setDisplayValue] = useState(0);

  // This will animate the count value from 0 to the actual value
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev < value) {
          return Math.min(prev + Math.ceil(value / 100), value); // Increase by small steps
        }
        clearInterval(interval);
        return value;
      });
    }, 30); // Adjust the interval for speed of animation
    return () => clearInterval(interval);
  }, [value]);

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.05)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      <CardHeader
        title={<Typography variant="subtitle1" fontWeight="bold">{title}</Typography>}
        avatar={<Icon className="h-6 w-6 text-primary" />}
        sx={{ paddingBottom: 0 }}
      />
      <CardContent>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#D6043C' }}>
          {new Intl.NumberFormat().format(displayValue)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState([
    { title: "Total Users", value: 0, icon: Users },
    { title: "Quizzes Taken", value: 0, icon: BookOpen },
    { title: "Active Subscriptions", value: 0, icon: CreditCard },
    { title: "Total News Articles", value: 0, icon: Newspaper },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [userCount, quizCount, subscriptionCount, newsCount] = await Promise.all([
          CountService.getUserCount(),
          CountService.getQuizCount(),
          CountService.getSubscriptionCount(),
          CountService.getNewsCount(),
        ]);

        const parseNumber = (value) => {
          const parsedValue = Number(value);
          return isNaN(parsedValue) ? 0 : parsedValue;
        };

        setStats([
          { title: "Total Users", value: parseNumber(userCount), icon: Users },
          { title: "Quizzes Taken", value: parseNumber(quizCount), icon: BookOpen },
          { title: "Active Subscriptions", value: parseNumber(subscriptionCount), icon: CreditCard },
          { title: "Total News Articles", value: parseNumber(newsCount), icon: Newspaper },
        ]);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
        setStats((prevStats) =>
          prevStats.map((stat) => ({ ...stat, value: 0 }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background:"#F9FAFB" }}>
      <header>
        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 3, textAlign: 'center' }}>
          Dashboard
        </Typography>
      </header>
      <section
        style={{
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </div>
        ) : (
          stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))
        )}
      </section>
    </div>
  );
}
