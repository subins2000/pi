import math
import os
import time
import MySQLdb
import base64
import zlib
import sys

digits_to_calculate = int(sys.argv[1])

db = MySQLdb.connect(host=os.environ["OPENSHIFT_MYSQL_DB_HOST"],    # your host, usually localhost
                     user=os.environ["OPENSHIFT_MYSQL_DB_USERNAME"],         # your username
                     passwd=os.environ["OPENSHIFT_MYSQL_DB_PASSWORD"],  # your password
                     db="ws")
cur = db.cursor()

# The time when program start
START_TIME = time.time()

cur.execute("""
UPDATE `pi` SET `value` = %s WHERE `key_name` = %s
""", (START_TIME, "start"))

def output(name, content):
  cur.execute("UPDATE `pi` SET `value` = %s WHERE `key_name` = %s", (content, name))
  db.commit()

sq_i = 1
def sqrt(n, one):
  global sq_i
  """
  Return the square root of n as a fixed point number with the one
  passed in.  It uses a second order Newton-Raphson convergence.  This
  doubles the number of significant figures on each iteration.
  """
  # Use floating point arithmetic to make an initial guess
  floating_point_precision = 10**16
  output("status", "sqrt," + str(sq_i))
  
  n_float = float((n * floating_point_precision) // one) / floating_point_precision
  x = (int(floating_point_precision * math.sqrt(n_float)) * one) // floating_point_precision
  n_one = n * one
  while 1:
    sq_i+=1
    output("status", "sqrt," + str(sq_i))
    x_old = x
    x = (x + n_one // x) // 2
    if x == x_old:
      break
  return x

i = 0
Qab = 0
def pi_chudnovsky_bs(digits):
    global i
    """
    Compute int(pi * 10**digits)

    This is done using Chudnovsky's series with binary splitting
    """
    output("status", "init,1")
    one = 10**digits
    output("status", "init,2")
    sqrtC = sqrt(10005*one, one)
    
    output("status", "init,3")
    C = 640320
    C3_OVER_24 = C**3 // 24
    
    def bs(a, b):
        global i, Qab
        """
        Computes the terms for binary splitting the Chudnovsky infinite series

        a(a) = +/- (13591409 + 545140134*a)
        p(a) = (6*a-5)*(2*a-1)*(6*a-1)
        b(a) = 1
        q(a) = a*a*a*C3_OVER_24

        returns P(a,b), Q(a,b) and T(a,b)
        """
        
        """
        Subin Siby <subinsb.com>
        """
        
        if i != 0 and i != 1:
          calculated_digits = str(digits - (digits/i) + 7)
          output("status", "pi," + str(i) + "," +calculated_digits + "," + str(digits_to_calculate))
          
        """
        Calculate
        """
        if b - a == 1:
            # Directly compute P(a,a+1), Q(a,a+1) and T(a,a+1)
            if a == 0:
                Pab = Qab = 1
            else:
                Pab = (6*a-5)*(2*a-1)*(6*a-1)
                Qab = a*a*a*C3_OVER_24
            Tab = Pab * (13591409 + 545140134*a) # a(a) * p(a)
            if a & 1:
                Tab = -Tab
        else:
            # Recursively compute P(a,b), Q(a,b) and T(a,b)
            # m is the midpoint of a and b
            m = (a + b) // 2
            # Recursively calculate P(a,m), Q(a,m) and T(a,m)
            Pam, Qam, Tam = bs(a, m)
            # Recursively calculate P(m,b), Q(m,b) and T(m,b)
            Pmb, Qmb, Tmb = bs(m, b)
            # Now combine
            Pab = Pam * Pmb
            Qab = Qam * Qmb
            Tab = Qmb * Tam + Pam * Tmb
        
        i+=1
        return Pab, Qab, Tab
        
    # how many terms to compute
    DIGITS_PER_TERM = math.log10(C3_OVER_24/6/2/6)
    
    N = int(digits/DIGITS_PER_TERM + 1)
    
    # Calclate P(0,N) and Q(0,N)
    P, Q, S = bs(0, N)
    
    return Q*426880*sqrtC // S
    
pi = pi_chudnovsky_bs(digits_to_calculate)
# Compress Pi
pi = zlib.compress(str(pi))

# Save to DB
output("pi", pi)

db.close()
